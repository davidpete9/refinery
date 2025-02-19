package tools.refinery.language.utils;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.xtext.util.IResourceScopeCache;
import org.eclipse.xtext.util.Tuples;
import tools.refinery.language.model.problem.*;

import java.util.*;

@Singleton
public class ProblemDesugarer {
	@Inject
	private IResourceScopeCache cache = IResourceScopeCache.NullImpl.INSTANCE;

	@Inject
	private Provider<SymbolCollector> symbolCollectorProvider;

	public Optional<Problem> getBuiltinProblem(EObject context) {
		return Optional.ofNullable(context).map(EObject::eResource).flatMap(resource ->
				cache.get("builtinProblem", resource, () -> doGetBuiltinProblem(resource)));
	}

	private Optional<Problem> doGetBuiltinProblem(Resource resource) {
		return Optional.ofNullable(resource).map(Resource::getResourceSet)
				.map(resourceSet -> resourceSet.getResource(ProblemUtil.BUILTIN_LIBRARY_URI, true))
				.map(Resource::getContents).filter(contents -> !contents.isEmpty()).map(contents -> contents.get(0))
				.filter(Problem.class::isInstance).map(Problem.class::cast);
	}

	public Optional<BuiltinSymbols> getBuiltinSymbols(EObject context) {
		return getBuiltinProblem(context).map(builtin ->
				cache.get("builtinSymbols", builtin.eResource(), () -> doGetBuiltinSymbols(builtin)));
	}

	private BuiltinSymbols doGetBuiltinSymbols(Problem builtin) {
		var node = doGetDeclaration(builtin, ClassDeclaration.class, "node");
		var equals = doGetEqualsReference(node);
		var exists = doGetDeclaration(builtin, PredicateDefinition.class, "exists");
		var domain = doGetDeclaration(builtin, ClassDeclaration.class, "domain");
		var data = doGetDeclaration(builtin, ClassDeclaration.class, "data");
		var bool = doGetDeclaration(builtin, EnumDeclaration.class, "bool");
		var boolTrue = doGetLiteral(bool, "true");
		var boolFalse = doGetLiteral(bool, "false");
		var intClass = doGetDeclaration(builtin, ClassDeclaration.class, "int");
		var real = doGetDeclaration(builtin, ClassDeclaration.class, "real");
		var string = doGetDeclaration(builtin, ClassDeclaration.class, "string");
		var contained = doGetDeclaration(builtin, PredicateDefinition.class, "contained");
		var contains = doGetDeclaration(builtin, PredicateDefinition.class, "contains");
		var root = doGetDeclaration(builtin, PredicateDefinition.class, "root");
		return new BuiltinSymbols(builtin, node, equals, exists, domain, data, bool, boolTrue, boolFalse, intClass,
				real, string, contained, contains, root);
	}

	private <T extends Statement & NamedElement> T doGetDeclaration(Problem builtin, Class<T> type, String name) {
		return builtin.getStatements().stream().filter(type::isInstance).map(type::cast)
				.filter(declaration -> name.equals(declaration.getName())).findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Built-in declaration " + name + " was not found"));
	}

	private ReferenceDeclaration doGetEqualsReference(ClassDeclaration nodeClassDeclaration) {
		return nodeClassDeclaration.getReferenceDeclarations().stream()
				.filter(reference -> "equals".equals(reference.getName())).findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Reference " + "equals" + " not found"));
	}

	private Node doGetLiteral(EnumDeclaration enumDeclaration, String name) {
		return enumDeclaration.getLiterals().stream().filter(literal -> name.equals(literal.getName())).findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Enum literal " + name + " not found"));
	}

	public Collection<ClassDeclaration> getSuperclassesAndSelf(ClassDeclaration classDeclaration) {
		return cache.get(Tuples.create(classDeclaration, "superclassesAndSelf"), classDeclaration.eResource(),
				() -> doGetSuperclassesAndSelf(classDeclaration));
	}

	private Collection<ClassDeclaration> doGetSuperclassesAndSelf(ClassDeclaration classDeclaration) {
		var builtinSymbols = getBuiltinSymbols(classDeclaration);
		Set<ClassDeclaration> found = new HashSet<>();
		builtinSymbols.ifPresent(symbols -> found.add(symbols.node()));
		Deque<ClassDeclaration> queue = new ArrayDeque<>();
		queue.addLast(classDeclaration);
		while (!queue.isEmpty()) {
			ClassDeclaration current = queue.removeFirst();
			if (!found.contains(current)) {
				found.add(current);
				for (Relation superType : current.getSuperTypes()) {
					if (superType instanceof ClassDeclaration superDeclaration) {
						queue.addLast(superDeclaration);
					}
				}
			}
		}
		if (builtinSymbols.isPresent() && !found.contains(builtinSymbols.get().data())) {
			found.add(builtinSymbols.get().domain());
		}
		return found;
	}

	public Collection<ReferenceDeclaration> getAllReferenceDeclarations(ClassDeclaration classDeclaration) {
		return cache.get(Tuples.create(classDeclaration, "allReferenceDeclarations"), classDeclaration.eResource(),
				() -> doGetAllReferenceDeclarations(classDeclaration));
	}

	private Collection<ReferenceDeclaration> doGetAllReferenceDeclarations(ClassDeclaration classDeclaration) {
		Set<ReferenceDeclaration> referenceDeclarations = new HashSet<>();
		for (ClassDeclaration superclass : getSuperclassesAndSelf(classDeclaration)) {
			referenceDeclarations.addAll(superclass.getReferenceDeclarations());
		}
		return referenceDeclarations;
	}

	public boolean isContainmentReference(ReferenceDeclaration referenceDeclaration) {
		switch (referenceDeclaration.getKind()) {
		case REFERENCE, CONTAINER:
			return false;
		case CONTAINMENT:
			return true;
		case DEFAULT:
			return isDataClass(referenceDeclaration.getReferenceType());
		default:
			throw new IllegalArgumentException("Unknown reference kind " + referenceDeclaration.getKind());
		}
	}

	public boolean isDataClass(Relation relation) {
		if (relation instanceof ClassDeclaration classDeclaration) {
			var supertypes = getSuperclassesAndSelf(classDeclaration);
			var builtinSymbols = getBuiltinSymbols(relation);
			return builtinSymbols.isPresent() && supertypes.contains(builtinSymbols.get().data());
		}
		return false;
	}

	public CollectedSymbols collectSymbols(Problem problem) {
		return cache.get(Tuples.create(problem, "collectedSymbols"), problem.eResource(),
				() -> symbolCollectorProvider.get().collectSymbols(problem));
	}
}
