import errorSVG from '@material-icons/svg/svg/error/baseline.svg?raw';
import expandMoreSVG from '@material-icons/svg/svg/expand_more/baseline.svg?raw';
import infoSVG from '@material-icons/svg/svg/info/baseline.svg?raw';
import warningSVG from '@material-icons/svg/svg/warning/baseline.svg?raw';
import { alpha, styled, type CSSObject } from '@mui/material/styles';

function svgURL(svg: string): string {
  return `url('data:image/svg+xml;utf8,${svg}')`;
}

function radialShadowTheme(
  origin: string,
  scaleX: boolean,
  scaleY: boolean,
): CSSObject {
  function radialGradient(opacity: number, scale: string): string {
    return `radial-gradient(
        farthest-side at ${origin},
        rgba(0, 0, 0, ${opacity}),
        rgba(0, 0, 0, 0)
      )
      ${origin} /
      ${scaleX ? scale : '100%'}
      ${scaleY ? scale : '100%'}
      no-repeat`;
  }

  return {
    background: `
      ${radialGradient(0.2, '40%')},
      ${radialGradient(0.14, '50%')},
      ${radialGradient(0.12, '100%')}
    `,
  };
}

export default styled('div', {
  name: 'EditorTheme',
  shouldForwardProp: (propName) =>
    propName !== 'showLineNumbers' && propName !== 'showActiveLine',
})<{
  showLineNumbers: boolean;
  showActiveLine: boolean;
}>(({ theme, showLineNumbers, showActiveLine }) => {
  const editorFontStyle: CSSObject = {
    ...theme.typography.editor,
    fontWeight: theme.typography.fontWeightEditorNormal,
    [theme.breakpoints.down('sm')]: {
      // `rem` for JetBrains MonoVariable make the text too large in Safari.
      fontSize: '14px',
      lineHeight: 1.43,
    },
  };

  const generalStyle: CSSObject = {
    background: theme.palette.background.default,
    '&, .cm-editor': {
      height: '100%',
    },
    '.cm-scroller-holder': {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      overflow: 'hidden',
      flex: '1 1',
    },
    '.cm-scroller': {
      color: theme.palette.text.secondary,
      scrollbarWidth: 'none',
      MsOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        width: 0,
        height: 0,
        background: 'transparent',
      },
    },
    '.cm-scroller-thumb': {
      position: 'absolute',
      background: theme.palette.text.secondary,
      opacity: theme.palette.mode === 'dark' ? 0.16 : 0.28,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shortest,
      }),
      '&:hover': {
        opacity: 0.75,
      },
      '&.active': {
        opacity: 1,
        pointerEvents: 'none',
        userSelect: 'none',
      },
    },
    '.cm-scroller-thumb-y': {
      top: 0,
      right: 0,
    },
    '.cm-scroller-thumb-x': {
      left: 0,
      bottom: 0,
    },
    '.cm-scroller-gutter-decoration': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 0,
      transition: theme.transitions.create('width', {
        duration: theme.transitions.duration.shortest,
      }),
      ...radialShadowTheme('0 50%', true, false),
    },
    '.cm-scroller-top-decoration': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 0,
      transition: theme.transitions.create('height', {
        duration: theme.transitions.duration.shortest,
      }),
      ...radialShadowTheme('50% 0', false, true),
    },
    '.cm-gutters': {
      background: theme.palette.background.default,
      border: 'none',
    },
    '.cm-content': {
      ...editorFontStyle,
      padding: 0,
    },
    '.cm-activeLine': {
      background: showActiveLine
        ? theme.palette.highlight.activeLine
        : 'transparent',
    },
    '.cm-activeLineGutter': {
      background: 'transparent',
    },
    '.cm-cursor, .cm-cursor-primary': {
      borderLeft: `2px solid ${theme.palette.highlight.cursor}`,
    },
    '.cm-selectionBackground': {
      background: theme.palette.highlight.selection,
    },
    '.cm-focused': {
      outline: 'none',
      '.cm-selectionBackground': {
        background: theme.palette.highlight.selection,
      },
    },
    '.cm-line': {
      position: 'relative', // For indentation highlights
    },
  };

  const highlightingStyle: CSSObject = {
    '.cm-specialChar': {
      color: theme.palette.secondary.main,
    },
    '.tok-comment': {
      fontStyle: 'italic',
      color: theme.palette.highlight.comment,
    },
    '.tok-number': {
      color: theme.palette.highlight.number,
    },
    '.tok-string': {
      color: theme.palette.secondary,
    },
    '.tok-keyword': {
      color: theme.palette.primary.main,
    },
    '.tok-typeName, .tok-atom': {
      color: theme.palette.text.primary,
    },
    '.tok-variableName': {
      color: theme.palette.highlight.parameter,
    },
    '.tok-problem-node': {
      '&, & .tok-variableName': {
        color: theme.palette.text.secondary,
      },
    },
    '.tok-problem-individual': {
      '&, & .tok-variableName': {
        color: theme.palette.text.primary,
      },
    },
    '.tok-problem-abstract, .tok-problem-new': {
      fontStyle: 'italic',
    },
    '.tok-problem-containment': {
      fontWeight: theme.typography.fontWeightEditorBold,
      textDecorationSkipInk: 'none',
    },
    '.tok-problem-error': {
      '&, & .tok-typeName': {
        color: theme.palette.error.main,
      },
    },
    '.tok-problem-builtin': {
      '&, & .tok-typeName, & .tok-atom, & .tok-variableName': {
        color: theme.palette.primary.main,
        fontWeight: 400,
        fontStyle: 'normal',
      },
    },
  };

  const matchingStyle: CSSObject = {
    '.cm-problem-read': {
      background: theme.palette.highlight.occurences.read,
    },
    '.cm-problem-write': {
      background: theme.palette.highlight.occurences.write,
    },
    '.cm-matchingBracket, .cm-nonmatchingBracket': {
      background: 'transparent',
    },
    '.cm-focused .cm-matchingBracket': {
      background: 'transparent',
      outline: `1px solid ${alpha(theme.palette.text.primary, 0.5)}`,
      outlineOffset: -1,
    },
    '.cm-focused .cm-nonmatchingBracket': {
      background: theme.palette.error.main,
      '&, span': {
        color: theme.palette.error.contrastText,
      },
    },
    '.cm-searchMatch': {
      opacity: 1,
      background: theme.palette.highlight.search.match,
      '&, span': {
        color: theme.palette.highlight.search.contrastText,
      },
    },
    '.cm-searchMatch-selected': {
      background: theme.palette.highlight.search.selected,
    },
    '.cm-indentation-marker': {
      display: 'inline-block',
      boxShadow: `1px 0 0 ${theme.palette.highlight.lineNumber} inset`,
      '&.active': {
        boxShadow: `1px 0 0 ${theme.palette.text.primary} inset`,
      },
    },
    '.cm-scroller-selection': {
      position: 'absolute',
      right: 0,
      boxShadow: `0 2px 0 ${theme.palette.highlight.cursor} inset`,
      zIndex: 200,
    },
    '.cm-scroller-occurrence': {
      position: 'absolute',
      background: theme.palette.text.secondary,
      zIndex: 150,
    },
  };

  const lineNumberStyle: CSSObject = {
    '.cm-lineNumbers': {
      ...editorFontStyle,
      color: theme.palette.highlight.lineNumber,
      ...(!showLineNumbers && {
        display: 'none !important',
      }),
      '.cm-gutterElement': {
        padding: '0 2px 0 6px',
      },
      '.cm-activeLineGutter': {
        color: theme.palette.text.primary,
      },
    },
  };

  const panelStyle: CSSObject = {
    '.cm-panels-top': {
      color: theme.palette.text.primary,
      borderBottom: `1px solid ${theme.palette.outer.border}`,
    },
    '.cm-panels-top + div + .cm-scroller': {
      paddingTop: theme.spacing(0.5),
    },
    '.cm-panel': {
      color: theme.palette.text.primary,
      background: theme.palette.outer.background,
      borderTop: `1px solid ${theme.palette.outer.border}`,
      margin: 0,
      padding: 0,
      'button[name="close"]': {
        background: 'transparent',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
      },
    },
  };

  function lintSeverityStyle(
    severity: 'error' | 'warning' | 'info',
    icon: string,
    zIndex: number,
  ): CSSObject {
    const palette = theme.palette[severity];
    const color = palette.main;
    const tooltipColor = theme.palette.mode === 'dark' ? color : palette.light;
    const iconStyle: CSSObject = {
      background: color,
      maskImage: svgURL(icon),
      maskSize: '16px 16px',
      height: 16,
      width: 16,
    };
    return {
      [`.cm-lintRange-${severity}`]: {
        backgroundImage: 'none',
        textDecoration: `underline wavy ${color}`,
        textDecorationSkipInk: 'none',
      },
      [`.cm-diagnostic-${severity}`]: {
        marginLeft: 0,
        padding: '4px 8px 4px 32px',
        borderLeft: 'none',
        position: 'relative',
        '::before': {
          ...iconStyle,
          content: '" "',
          position: 'absolute',
          top: 6,
          left: 8,
        },
      },
      [`.cm-tooltip .cm-diagnostic-${severity}::before`]: {
        background: tooltipColor,
      },
      [`.cm-panel.cm-panel-lint .cm-diagnostic-${severity}::before`]: {
        top: 8,
        [theme.breakpoints.down('sm')]: {
          top: 6,
        },
      },
      [`.cm-lint-marker-${severity}`]: {
        ...iconStyle,
        display: 'block',
        margin: '4px 0',
        // Remove original CodeMirror icon.
        content: '""',
        [theme.breakpoints.down('sm')]: {
          margin: '2px 0',
        },
        '::before': {
          // Remove original CodeMirror icon.
          content: '""',
          display: 'none',
        },
      },
      [`.cm-scroller-diagnostic-${severity}`]: {
        position: 'absolute',
        right: 0,
        background: color,
        zIndex,
      },
    };
  }

  const lintStyle: CSSObject = {
    '.cm-gutter-lint': {
      width: 16,
      '.cm-gutterElement': {
        padding: 0,
      },
    },
    '.cm-tooltip.cm-tooltip-hover, .cm-tooltip.cm-tooltip-lint': {
      ...((theme.components?.MuiTooltip?.styleOverrides?.tooltip as
        | CSSObject
        | undefined) || {}),
      ...theme.typography.body2,
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      maxWidth: 400,
    },
    '.cm-panel.cm-panel-lint': {
      borderTop: `1px solid ${theme.palette.outer.border}`,
      borderBottom: 'none',
      'button[name="close"]': {
        // Close button interferes with scrollbar, so we better hide it.
        // The panel can still be closed from the toolbar.
        display: 'none',
      },
      ul: {
        maxHeight: `max(${32 * 4}px, 20vh)`,
        li: {
          cursor: 'pointer',
          color: theme.palette.text.primary,
        },
        '.cm-diagnostic': {
          ...theme.typography.body1,
          [theme.breakpoints.down('sm')]: {
            ...theme.typography.body2,
          },
          '&[aria-selected="true"]': {
            color: theme.palette.text.primary,
            background: 'transparent',
            fontWeight: theme.typography.fontWeightMedium,
          },
          ':hover': {
            background: alpha(
              theme.palette.text.primary,
              theme.palette.action.hoverOpacity,
            ),
            '@media (hover: none)': {
              background: 'transparent',
            },
          },
        },
      },
    },
    '.cm-lintRange-active': {
      background: theme.palette.highlight.activeLintRange,
    },
    ...lintSeverityStyle('error', errorSVG, 120),
    ...lintSeverityStyle('warning', warningSVG, 110),
    ...lintSeverityStyle('info', infoSVG, 100),
  };

  const foldStyle = {
    '.cm-foldGutter': {
      width: 16,
    },
    '.problem-editor-foldMarker': {
      display: 'block',
      margin: '4px 0',
      padding: 0,
      maskImage: svgURL(expandMoreSVG),
      maskSize: '16px 16px',
      height: 16,
      width: 16,
      background: theme.palette.text.primary,
      border: 'none',
      cursor: 'pointer',
      [theme.breakpoints.down('sm')]: {
        margin: '2px 0',
      },
    },
    '.problem-editor-foldMarker-open': {
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.short,
      }),
      '@media (hover: none)': {
        opacity: 1,
      },
    },
    '.cm-gutters:hover .problem-editor-foldMarker-open': {
      opacity: 1,
    },
    '.problem-editor-foldMarker-closed': {
      transform: 'rotate(-90deg)',
    },
    '.problem-editor-foldPlaceholder': {
      ...editorFontStyle,
      padding: 0,
      fontFamily: 'inherit',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      // Use an inner `span` element to match the height of other text highlights.
      span: {
        color: theme.palette.text.secondary,
        backgroundColor: 'transparent',
        backgroundImage: `linear-gradient(${theme.palette.highlight.foldPlaceholder}, ${theme.palette.highlight.foldPlaceholder})`,
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.short,
        }),
      },
      '&:hover span': {
        backgroundColor: alpha(
          theme.palette.highlight.foldPlaceholder,
          theme.palette.action.hoverOpacity,
        ),
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
  };

  const completionStyle: CSSObject = {
    '.cm-tooltip.cm-tooltip-autocomplete': {
      ...editorFontStyle,
      background: theme.palette.background.paper,
      border: 'none',
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      ...(theme.palette.mode === 'dark' && {
        // https://github.com/mui/material-ui/blob/10c72729c7d03bab8cdce6eb422642684c56dca2/packages/mui-material/src/Paper/Paper.js#L18
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))',
      }),
      boxShadow: theme.shadows[2],
      '.cm-completionIcon': {
        color: theme.palette.text.secondary,
      },
      '.cm-completionLabel': {
        ...editorFontStyle,
        color: theme.palette.text.primary,
      },
      '.cm-completionDetail': {
        ...editorFontStyle,
        color: theme.palette.text.secondary,
        fontStyle: 'normal',
      },
      'li[aria-selected="true"]': {
        background: alpha(
          theme.palette.text.primary,
          theme.palette.action.focusOpacity,
        ),
        '.cm-completionIcon, .cm-completionLabel, .cm-completionDetail': {
          color: theme.palette.text.primary,
        },
      },
    },
    '.cm-completionIcon': {
      width: 16,
      padding: 0,
      marginRight: '0.5em',
      textAlign: 'center',
    },
  };

  return {
    ...generalStyle,
    ...highlightingStyle,
    ...matchingStyle,
    ...lineNumberStyle,
    ...panelStyle,
    ...lintStyle,
    ...foldStyle,
    ...completionStyle,
  };
});
