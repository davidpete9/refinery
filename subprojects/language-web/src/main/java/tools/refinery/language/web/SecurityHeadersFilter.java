package tools.refinery.language.web;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class SecurityHeadersFilter implements Filter {
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
			ServletException {
		if (response instanceof HttpServletResponse httpResponse) {
			httpResponse.setHeader("Content-Security-Policy", "default-src 'none'; " +
					"script-src 'self'; " +
					// CodeMirror needs inline styles, see e.g.,
					// https://discuss.codemirror.net/t/inline-styles-and-content-security-policy/1311/2
					"style-src 'self' 'unsafe-inline'; " +
					// Use 'data:' for displaying inline SVG backgrounds.
					"img-src 'self' data:; " +
					"font-src 'self'; " +
					"connect-src 'self'; " +
					"manifest-src 'self'; " +
					"worker-src 'self';");
			httpResponse.setHeader("X-Content-Type-Options", "nosniff");
			httpResponse.setHeader("X-Frame-Options", "DENY");
			httpResponse.setHeader("Referrer-Policy", "strict-origin");
			// Enable cross-origin isolation, https://web.dev/cross-origin-isolation-guide/
			httpResponse.setHeader("Cross-Origin-Opener-Policy", "same-origin");
			httpResponse.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
			// We do not expose any sensitive data over HTTP, so <code>cross-origin</code> is safe here.
			httpResponse.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
		}
		chain.doFilter(request, response);
	}
}
