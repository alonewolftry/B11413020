import React from 'react';

interface PythonSyntaxTextProps {
  line: string;
}

const KEYWORDS = new Set([
  'class',
  'def',
  'return',
  'if',
  'else',
  'elif',
  'not',
  'or',
  'and',
  'True',
  'False',
  'None',
  'super',
]);

export const PythonSyntaxText: React.FC<PythonSyntaxTextProps> = ({ line }) => {
  if (!line) {
    return <span>&nbsp;</span>;
  }

  // Split comment first
  const commentIndex = line.indexOf('#');
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : '';

  // Tokenize strings, identifiers, numbers, punctuation
  const tokenRegex = /(f?"[^"]*"|f?'[^']*'|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+\b|[^\sA-Za-z0-9_"']+|\s+)/g;
  const tokens = codePart.match(tokenRegex) ?? [codePart];

  return (
    <span>
      {tokens.map((tok, idx) => {
        if (/^(f?"[^"]*"|f?'[^']*')$/.test(tok)) {
          return (
            <span key={idx} className="text-emerald-700">
              {tok}
            </span>
          );
        }
        if (KEYWORDS.has(tok)) {
          return (
            <span key={idx} className="font-semibold text-sky-700">
              {tok}
            </span>
          );
        }
        if (tok === 'self') {
          return (
            <span key={idx} className="font-medium text-amber-700">
              {tok}
            </span>
          );
        }
        if (/^__[a-zA-Z0-9_]+__$/.test(tok)) {
          return (
            <span key={idx} className="font-medium text-indigo-700">
              {tok}
            </span>
          );
        }
        if (/^\d+$/.test(tok)) {
          return (
            <span key={idx} className="text-orange-700">
              {tok}
            </span>
          );
        }
        return (
          <span key={idx} className="text-slate-800">
            {tok}
          </span>
        );
      })}
      {commentPart && <span className="italic text-slate-400">{commentPart}</span>}
    </span>
  );
};
