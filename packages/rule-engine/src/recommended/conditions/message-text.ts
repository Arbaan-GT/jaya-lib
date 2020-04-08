import { ProductEventData, MessagePart } from '@freshworks-jaya/marketplace-models';
import { Condition } from '../../models/rule';
import { Utils } from '../../Utils';

/**
 * Gets a concatenated string of messageParts with type 'text'.
 */
const getMessagePartsTextContent = (messageParts: MessagePart[]): string => {
  let messageContent = '';

  if (messageParts && messageParts.length) {
    messageContent = messageParts
      .filter((messagePart) => messagePart.text)
      .map((messagePart) => {
        return messagePart.text && messagePart.text.content;
      })
      .join(' ');
  }

  return messageContent;
};

export default (condition: Condition, productEventData: ProductEventData): boolean => {
  const modelProperties = productEventData.conversation || productEventData.message;

  return Utils.evaluateCondition(
    condition.operator,
    getMessagePartsTextContent(modelProperties.messages[0].message_parts),
    condition.value as string,
  );
};
