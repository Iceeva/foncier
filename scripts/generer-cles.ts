import { genererPaireDeCles } from "../src/lib/domain/signature";
const { prive, publique } = genererPaireDeCles();
console.log('PLATFORM_SIGNING_PRIVATE_KEY="%s"', prive);
console.log('PLATFORM_SIGNING_PUBLIC_KEY="%s"', publique);
