export const computeValue = (rawValue: string) => {
  const parsed = parseExpression(rawValue);

  return parsed ? evaluate(parsed) : rawValue;
};

const parseExpression = (value: string): Expression | null => {
  if (isNumber(value)) {
    return { type: 'literal', value: toNumber(value) };
  }

  if (value.startsWith('=')) {
    const [expression, remaining] = parseHelp(value.slice(1));

    if (expression && remaining === '') {
      return expression;
    }
  }

  return null;
};

const parseHelp = (value: string): [Expression | null, string] => {
  const digits = takeWhile(isNumber, value);

  if (digits) {
    const numbers = toNumber(digits);

    if (isNaN(numbers)) {
      return [null, digits];
    }

    return [{ type: 'literal', value: numbers }, value.slice(digits.length)];
  }

  const [operationName, ...rest] = value.split('(');
  const operation = operationMap.get(operationName);

  if (operation) {
    const [leftExpression, afterLeft] = parseHelp(rest.join('('));
    const afterLeftTrimmed = afterLeft.trim();

    if (leftExpression && afterLeftTrimmed.startsWith(',')) {
      const [rightExpression, afterRight] = parseHelp(
        afterLeftTrimmed.slice(1)
      );

      const afterRightTrimmed = afterRight.trim();

      if (rightExpression && afterRightTrimmed.startsWith(')')) {
        return [
          {
            type: 'operation',
            eLeft: leftExpression,
            eRight: rightExpression,
            name: operation,
          },
          afterRightTrimmed.slice(1),
        ];
      }
    }
  }

  return [null, ''];
};

const evaluate = (expression: Expression): number => {
  if (expression.type === 'literal') {
    return expression.value;
  }

  return applyOperation(
    expression.name,
    evaluate(expression.eLeft),
    evaluate(expression.eRight)
  );
};

const applyOperation = (operation: OperationName, a: number, b: number) => {
  switch (operation) {
    case 'add':
      return a + b;

    case 'mul':
      return a * b;
  }
};

const toNumber = (value: string) => Number(value);
const isNumber = (value: string) => !isNaN(Number(value));

const operationMap: Map<string, OperationName> = new Map([
  ['add', 'add'],
  ['mul', 'mul'],
]);

type Expression =
  | { type: 'literal'; value: number }
  | {
      type: 'operation';
      name: OperationName;
      eLeft: Expression;
      eRight: Expression;
    };

type OperationName = 'add' | 'mul';

const takeWhile = (pred: (v: string) => boolean, string: string) => {
  let newString = '';

  for (const c of string) {
    if (!pred(c)) {
      break;
    }

    newString += c;
  }

  return newString;
};
