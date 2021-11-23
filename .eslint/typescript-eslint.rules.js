module.exports = {
  '@typescript-eslint/array-type': ['error', { default: 'array' }],
  '@typescript-eslint/ban-tslint-comment': 'error',
  '@typescript-eslint/class-literal-property-style': 'error',
  '@typescript-eslint/consistent-indexed-object-style': 'error',
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'never'
    }
  ],
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/consistent-type-exports': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: false,
      allowTypedFunctionExpressions: false,
      allowHigherOrderFunctions: false,
      allowDirectConstAssertionInArrowFunctions: false,
      allowConciseArrowFunctionExpressionsStartingWithVoid: false
    }
  ],
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    {
      accessibility: 'explicit',
      overrides: {
        accessors: 'explicit',
        constructors: 'explicit',
        methods: 'explicit',
        properties: 'explicit',
        parameterProperties: 'explicit'
      }
    }
  ],
  '@typescript-eslint/member-delimiter-style': [
    'error',
    {
      multiline: {
        delimiter: 'semi',
        requireLast: true
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false
      },
      multilineDetection: 'brackets'
    }
  ],
  '@typescript-eslint/member-ordering': [
    'error',
    {
      default: {
        memberTypes: [
          'private-static-field',
          'protected-static-field',
          'public-static-field',
          'private-abstract-field',
          'protected-abstract-field',
          'public-abstract-field',
          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',
          'private-decorated-field',
          'protected-decorated-field',
          'public-decorated-field',

          'private-static-get',
          'protected-static-get',
          'public-static-get',
          'private-abstract-get',
          'protected-abstract-get',
          'public-abstract-get',
          'private-instance-get',
          'protected-instance-get',
          'public-instance-get',
          'private-decorated-get',
          'protected-decorated-get',
          'public-decorated-get',

          'private-static-set',
          'protected-static-set',
          'public-static-set',
          'private-abstract-set',
          'protected-abstract-set',
          'public-abstract-set',
          'private-instance-set',
          'protected-instance-set',
          'public-instance-set',
          'private-decorated-set',
          'protected-decorated-set',
          'public-decorated-set',

          'private-constructor',
          'protected-constructor',
          'public-constructor',

          'private-static-method',
          'protected-static-method',
          'public-static-method',
          'private-instance-method',
          'protected-instance-method',
          'public-instance-method',
          'private-abstract-method',
          'protected-abstract-method',
          'public-abstract-method',
          'private-decorated-method',
          'protected-decorated-method',
          'public-decorated-method',

          'signature'
        ],
        order: 'alphabetically'
      }
    }
  ],
  '@typescript-eslint/method-signature-style': ['off', 'property'],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'default',
      format: ['camelCase'],
      leadingUnderscore: 'forbid',
      trailingUnderscore: 'forbid'
    },
    {
      selector: 'enumMember',
      format: ['PascalCase']
    },
    {
      selector: 'typeLike',
      format: ['PascalCase']
    },
    {
      selector: 'property',
      format: ['camelCase'],
      modifiers: ['private'],
      leadingUnderscore: 'require'
    },
    {
      selector: 'variable',
      format: ['UPPER_CASE'],
      modifiers: ['global', 'const']
    },
    {
      selector: ['variable'],
      format: ['camelCase'],
      modifiers: ['global', 'const'],
      types: ['function']
    }
  ],
  '@typescript-eslint/no-base-to-string': 'error',

  '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true, ignoreVoidOperator: false }],
  '@typescript-eslint/no-dynamic-delete': 'error',
  '@typescript-eslint/no-extra-non-null-assertion': 'error',
  '@typescript-eslint/no-extraneous-class': [
    'error',
    {
      allowConstructorOnly: false,
      allowEmpty: false,
      allowStaticOnly: false,
      allowWithDecorator: true
    }
  ],
  '@typescript-eslint/no-floating-promises': [
    'error',
    {
      ignoreVoid: false,
      ignoreIIFE: false
    }
  ],
  '@typescript-eslint/no-inferrable-types': 'off',
  '@typescript-eslint/no-invalid-void-type': [
    'error',
    {
      allowInGenericTypeArguments: true,
      allowAsThisParameter: false
    }
  ],
  '@typescript-eslint/no-meaningless-void-operator': 'error',
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-parameter-properties': [
    'error',
    {
      allows: ['public readonly', 'protected readonly', 'private readonly']
    }
  ],
  '@typescript-eslint/no-require-imports': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'error',
  '@typescript-eslint/no-unnecessary-qualifier': 'error',
  '@typescript-eslint/no-unnecessary-type-arguments': 'error',
  '@typescript-eslint/non-nullable-type-assertion-style': 'error',
  '@typescript-eslint/prefer-enum-initializers': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-readonly': 'error',
  /*'@typescript-eslint/prefer-readonly-parameter-types': [
    'error',
    {
      checkParameterProperties: true,
      ignoreInferredTypes: false,
      treatMethodsAsReadonly: false,
    }
  ],*/
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/prefer-regexp-exec': 'error',
  '@typescript-eslint/prefer-return-this-type': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/prefer-ts-expect-error': 'error',
  '@typescript-eslint/promise-function-async': 'error',
  '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
  '@typescript-eslint/restrict-plus-operands': ['error', { checkCompoundAssignments: true }],
  '@typescript-eslint/sort-type-union-intersection-members': 'error',
  '@typescript-eslint/strict-boolean-expressions': [
    'error',
    {
      allowString: false,
      allowNumber: false,
      allowNullableObject: false,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false,
      allowAny: false,
      allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false
    }
  ],
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/typedef': [
    'error',
    {
      arrayDestructuring: true,
      arrowParameter: true,
      memberVariableDeclaration: true,
      objectDestructuring: true,
      parameter: true,
      propertyDeclaration: true,
      variableDeclaration: true,
      variableDeclarationIgnoreFunction: true
    }
  ],
  '@typescript-eslint/unified-signatures': 'error',
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/dot-notation': 'error',
  '@typescript-eslint/init-declarations': 'error',
  '@typescript-eslint/no-duplicate-imports': 'error',
  '@typescript-eslint/no-implied-eval': 'error',
  '@typescript-eslint/no-invalid-this': 'error',
  '@typescript-eslint/no-loop-func': 'error',
  '@typescript-eslint/no-magic-numbers': ['error', { ignore: [0, 1] }],
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        'assert',
        'buffer',
        'child_process',
        'cluster',
        'crypto',
        'dgram',
        'dns',
        'domain',
        'events',
        'freelist',
        'fs',
        'http',
        'https',
        'module',
        'net',
        'os',
        'path',
        'punycode',
        'querystring',
        'readline',
        'repl',
        'smalloc',
        'stream',
        'string_decoder',
        'sys',
        'timers',
        'tls',
        'tracing',
        'tty',
        'url',
        'util',
        'vm',
        'zlib'
      ]
    }
  ],
  '@typescript-eslint/no-shadow': ['error', { builtinGlobals: true, hoist: 'all' }],
  '@typescript-eslint/no-throw-literal': 'error',
  '@typescript-eslint/no-unused-expressions': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'all',
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      caughtErrors: 'all'
    }
  ],
  '@typescript-eslint/no-use-before-define': 'error',
  '@typescript-eslint/no-useless-constructor': 'error',
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/return-await': 'error'
};
