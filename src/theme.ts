import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    // İsteğe bağlı olarak burada token'ları (renkler, fontlar vb.) özelleştirebilirsiniz.
    // Örnek:
    // tokens: {
    //   colors: {
    //     brand: {
    //       50: { value: "#e6f2ff" },
    //       // ... diğer renk tonları
    //       950: { value: "#001a33" },
    //     },
    //   },
    //   fonts: {
    //     heading: { value: `'Inter', sans-serif` }, // Örnek font
    //     body: { value: `'Inter', sans-serif` },    // Örnek font
    //   },
    // },
    // semanticTokens: {
    //   colors: {
    //     brand: {
    //       solid: { value: "{colors.brand.500}" },
    //       // ... diğer semantik token'lar
    //     },
    //   },
    // },
  },
  // Gerekirse preflight (CSS reset) ayarını buradan yapabilirsiniz:
  // preflight: false, 
}); 