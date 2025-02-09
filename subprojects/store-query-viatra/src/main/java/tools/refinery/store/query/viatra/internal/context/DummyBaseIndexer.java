package tools.refinery.store.query.viatra.internal.context;

import org.eclipse.viatra.query.runtime.api.scope.IBaseIndex;
import org.eclipse.viatra.query.runtime.api.scope.IIndexingErrorListener;
import org.eclipse.viatra.query.runtime.api.scope.IInstanceObserver;
import org.eclipse.viatra.query.runtime.api.scope.ViatraBaseIndexChangeListener;

import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.Callable;

/**
 * Copied from <code>org.eclipse.viatra.query.runtime.tabular.TabularEngineContext</code>
 */
public class DummyBaseIndexer implements IBaseIndex {
	@Override
	public <V> V coalesceTraversals(Callable<V> callable) throws InvocationTargetException {
		try {
			return callable.call();
		} catch (Exception e) {
			throw new InvocationTargetException(e);
		}
	}

	@Override
	public void addBaseIndexChangeListener(ViatraBaseIndexChangeListener listener) {
		// no notification support
	}

	@Override
	public void removeBaseIndexChangeListener(ViatraBaseIndexChangeListener listener) {
		// no notification support
	}

	@Override
	public void resampleDerivedFeatures() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean addIndexingErrorListener(IIndexingErrorListener listener) {
		return true;
	}

	@Override
	public boolean removeIndexingErrorListener(IIndexingErrorListener listener) {
		return true;
	}

	@Override
	public boolean addInstanceObserver(IInstanceObserver observer, Object observedObject) {
		return true;
	}

	@Override
	public boolean removeInstanceObserver(IInstanceObserver observer, Object observedObject) {
		return true;
	}
}
