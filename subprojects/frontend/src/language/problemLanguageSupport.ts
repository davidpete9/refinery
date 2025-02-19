import {
  foldInside,
  foldNodeProp,
  indentNodeProp,
  indentUnit,
  LanguageSupport,
  LRLanguage,
} from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

import { foldBlockComment, foldConjunction, foldDeclaration } from './folding';
import {
  indentBlockComment,
  indentDeclaration,
  indentPredicateOrRule,
} from './indentation';
import { parser } from './problem.grammar';

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      LineComment: t.lineComment,
      BlockComment: t.blockComment,
      'problem class enum pred indiv scope': t.definitionKeyword,
      'abstract extends refers contains container opposite': t.modifier,
      'default error contained containment': t.modifier,
      'true false unknown error': t.operatorKeyword,
      'may must current count': t.operatorKeyword,
      // 'new delete': t.keyword,
      NotOp: t.operator,
      UnknownOp: t.operator,
      OrOp: t.separator,
      StarArgument: t.keyword,
      'IntMult StarMult Real': t.number,
      StarMult: t.number,
      String: t.string,
      'RelationName/QualifiedName': t.typeName,
      // 'RuleName/QualifiedName': t.typeName,
      'IndividualNodeName/QualifiedName': t.atom,
      'VariableName/QualifiedName': t.variableName,
      '{ }': t.brace,
      '( )': t.paren,
      '[ ]': t.squareBracket,
      '. .. , :': t.separator,
      '<-> ==>': t.definitionOperator,
    }),
    indentNodeProp.add({
      ProblemDeclaration: indentDeclaration,
      UniqueDeclaration: indentDeclaration,
      ScopeDeclaration: indentDeclaration,
      PredicateBody: indentPredicateOrRule,
      // RuleBody: indentPredicateOrRule,
      BlockComment: indentBlockComment,
    }),
    foldNodeProp.add({
      ClassBody: foldInside,
      EnumBody: foldInside,
      ParameterList: foldInside,
      PredicateBody: foldInside,
      // RuleBody: foldInside,
      Conjunction: foldConjunction,
      // Consequent: foldWholeNode,
      UniqueDeclaration: foldDeclaration,
      ScopeDeclaration: foldDeclaration,
      BlockComment: foldBlockComment,
    }),
  ],
});

const problemLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: {
      block: {
        open: '/*',
        close: '*/',
      },
      line: '%',
    },
    indentOnInput: /^\s*(?:\{|\}|\(|\)|;|\.)$/,
  },
});

export default function problemLanguageSupport(): LanguageSupport {
  return new LanguageSupport(problemLanguage, [indentUnit.of('    ')]);
}
