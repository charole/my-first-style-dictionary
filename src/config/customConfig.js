import StyleDictionary from "style-dictionary";
import { transformGroups, transforms } from "style-dictionary/enums";
import { getReferences } from "style-dictionary/utils";
import { getMappedValue } from "../constants.js";

export default {
  source: ["tokens/core.json", "tokens/semantic.json"],
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      transforms: [transforms.sizePx, transforms.colorHex],
      buildPath: "build/css/",
      files: [
        {
          destination: "_variables.css",
          format: "customCssFormat",
        },
      ],
    },
    // "flutter-separate": {
    //   transformGroup: "flutter-separate",
    //   buildPath: "build/flutter/",
    //   files: [
    //     {
    //       destination: "style_dictionary_color.dart",
    //       format: "flutter/class.dart",
    //       options: {
    //         className: "StyleDictionaryColor",
    //         type: "color",
    //       },
    //       filter: {
    //         type: "color",
    //       },
    //     },
    //     {
    //       destination: "style_dictionary_sizes.dart",
    //       format: "flutter/class.dart",
    //       options: {
    //         className: "StyleDictionarySize",
    //         type: "float",
    //       },
    //       filter: {
    //         type: "color",
    //       },
    //     },
    //   ],
    // },
    flutter: {
      transformGroup: transformGroups.flutter,
      transforms: ["string/flutter/literal"],
      // dimension 값은 이미 px 이므로 size/flutter/remToDouble 의 rem→px 배율(기본 16)을 끈다.
      basePxFontSize: 1,
      buildPath: "build/flutter/",
      files: [
        {
          destination: "variables.dart",
          format: "flutter/class.dart",
          options: {
            className: "StyleDictionary",
          },
        },
      ],
    },
  },
};

// 내장 content/flutter/literal 은 type 이 "content" 인 토큰만 감싼다.
// 이 프로젝트의 문자열 토큰(type "string")도 Dart 문자열 리터럴로 출력한다.
StyleDictionary.registerTransform({
  name: "string/flutter/literal",
  type: "value",
  filter: (token) => token.type === "string",
  transform: (token) => `"${token.value}"`,
});

StyleDictionary.registerFormat({
  name: "customCssFormat",
  format: function ({ dictionary }) {
    const allTokens = dictionary.allTokens;

    function isReference(value) {
      // 값 전체가 참조 하나일 때만 (예: "{a.b}"). "{a} {b}" 같은 조합 값은 해석된 값을 그대로 쓴다.
      return typeof value === "string" && /^\{[^{}]+\}$/.test(value);
    }

    // 참조 경로를 직접 가공하지 않고, Style Dictionary 가 이름 변환(name/kebab)까지
    // 마친 참조 토큰의 name 을 쓴다. 경로를 손으로 바꾸면 특수문자를
    // 정리하는 변환 규칙과 어긋나 정의되지 않은 변수를 가리키게 된다.
    function referenceToVariable(reference) {
      const [ref] = getReferences(reference, dictionary.tokens, {
        unfilteredTokens: dictionary.unfilteredTokens,
        warnImmediately: false,
      });
      return ref ? `var(--${ref.name})` : undefined;
    }

    const customTokens = allTokens
      .filter(({ value }) => value !== undefined && value !== null && value !== "")
      .map(({ name, value, original }) => {
        let finalValue;

        if (original && original.value && isReference(original.value)) {
          finalValue = referenceToVariable(original.value) ?? value;
        } else {
          finalValue = getMappedValue({ tokenName: name, value });
        }

        return `\t--${name}: ${finalValue};`;
      });

    return `:root {\n${customTokens.join("\n")}\n}\n`;
  },
});
