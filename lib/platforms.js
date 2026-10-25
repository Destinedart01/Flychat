// Single source of truth for platform differences. Add a new platform
// here first, then wire it into the create form / button / icon map --
// everything else reads from this.
export const PLATFORMS = {
  whatsapp: {
    key: 'whatsapp',
    label: 'WhatsApp',
    fieldType: 'phone',
    supportsMessage: true,
    buttonText: 'Chat on WhatsApp',
    buildUrl: ({ countryCode, phone, message }) => {
      const digits = `${countryCode || ''}${phone || ''}`.replace(/[^0-9]/g, '');
      const text = message ? `?text=${encodeURIComponent(message)}` : '';
      return `https://wa.me/${digits}${text}`;
    },
  },
  telegram: {
    key: 'telegram',
    label: 'Telegram',
    fieldType: 'username',
    supportsMessage: true,
    buttonText: 'Message on Telegram',
    buildUrl: ({ username, message }) => {
      const handle = (username || '').replace(/^@/, '');
      const text = message ? `?text=${encodeURIComponent(message)}` : '';
      return `https://t.me/${handle}${text}`;
    },
  },
  instagram: {
    key: 'instagram',
    label: 'Instagram',
    fieldType: 'username',
    supportsMessage: false,
    buttonText: 'Message on Instagram',
    buildUrl: ({ username }) => {
      const handle = (username || '').replace(/^@/, '');
      return `https://ig.me/m/${handle}`;
    },
  },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

export function getPlatform(key) {
  return PLATFORMS[key] || PLATFORMS.whatsapp;
}
