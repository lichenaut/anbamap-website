export function getElementById(id: string): HTMLElement {
  let element: HTMLElement | null = document.getElementById(id);
  if (element === null) {
    throw new Error(`${id} element not found`);
  }
  return element;
}

export function getDatasetValue(element: HTMLElement, key: string): string {
  let dataValue: string | undefined = element.dataset[key];
  if (dataValue === undefined) {
    throw new Error(`${key} not found`);
  }
  return dataValue;
}

export function parseJsonToMap(json: string): Map<string, number> {
  return new Map(Object.entries(JSON.parse(json)));
}
