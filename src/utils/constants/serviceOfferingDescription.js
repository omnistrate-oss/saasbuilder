export const getServiceOfferingDesciption = (value) => {
  if (!value) {
    return null;
  }

  const strippedString = value.replace(/(<([^>]+)>)/gi, "");
  return strippedString;
};

const isBlockLevel = (element) => {
  const blockLevelElements = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "ul", "ol", "li", "blockquote"];
  return blockLevelElements.includes(element.tagName.toLowerCase());
};

export const parseOfferingDescriptionDom = (value) => {
  if (!value) return null;

  const parser = new DOMParser();

  // Parse the HTML string
  const doc = parser.parseFromString(value, "text/html");

  // Get the text content
  const textContent = doc.body.textContent;

  const textContentWithSpaces = Array.from(doc.body.children)
    .map((child) => {
      if (isBlockLevel(child)) {
        return child.textContent.trim() + " ";
      }
      return child.textContent.trim();
    })
    .join("");
  if (!textContentWithSpaces) {
    return textContent;
  }
  return textContentWithSpaces;
};
