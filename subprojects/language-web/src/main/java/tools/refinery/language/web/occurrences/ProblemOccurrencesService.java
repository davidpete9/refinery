package tools.refinery.language.web.occurrences;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.xtext.web.server.occurrences.OccurrencesService;

import com.google.inject.Singleton;

import tools.refinery.language.model.problem.NamedElement;

@Singleton
public class ProblemOccurrencesService extends OccurrencesService {
	@Override
	protected boolean filter(EObject element) {
		return super.filter(element) && element instanceof NamedElement;
	}
}
