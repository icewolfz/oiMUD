// @ts-ignore
import { parser } from "./syntax.grammar"
import { LRLanguage, LanguageSupport, foldNodeProp, foldInside } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"

export const oiMUDLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Identifier: t.variableName,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        "{ }": t.paren
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//" }
  }
})

export function oiMUD() {
  return new LanguageSupport(oiMUDLanguage)
}