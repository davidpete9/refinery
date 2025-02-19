package tools.refinery.language.web.xtext.server.push;

import org.eclipse.xtext.web.server.IServiceResult;

import tools.refinery.language.web.xtext.server.ResponseHandlerException;

@FunctionalInterface
public interface PrecomputationListener {
	void onPrecomputedServiceResult(String resourceId, String stateId, String serviceName, IServiceResult serviceResult)
			throws ResponseHandlerException;

	default void onSubscribeToPrecomputationEvents(String resourceId, PushWebDocument document) {
		// Nothing to handle by default.
	}
}
