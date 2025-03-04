import { textRegistry, getRegistryByReligion } from '../data/registry';

interface ReligiousText {
  id: string;
  title: string;
  description: string;
  type?: string;
  religion: string;
}

export const getTextContent = async (id: string, religion: string) => {
  try {
    const loader = textRegistry[id];
    if (!loader) {
      console.error(`No loader found for text: ${id}`);
      return null;
    }

    const result = await loader();
    return result.default || result;
  } catch (error) {
    console.error(`Failed to load text content: ${id}`, error);
    return null;
  }
};

export const getTexts = async (religion: string): Promise<ReligiousText[]> => {
  try {
    const registry = getRegistryByReligion(religion);
    const texts = [];
    
    for (const [id, loader] of Object.entries(registry)) {
      try {
        const result = await loader();
        const data = result.default || result;
        
        if (data?.info) {
          texts.push({
            id,
            ...data.info
          });
        } else if (data?.title && data?.religion) {
          texts.push({
            id,
            title: data.title,
            description: data.description,
            type: data.type,
            religion: data.religion
          });
        }
      } catch (error) {
        console.error(`Error loading text ${id}:`, error);
      }
    }
    
    return texts;
  } catch (error) {
    console.error('Error loading texts:', error);
    return [];
  }
};
