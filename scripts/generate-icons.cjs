const sharp = require('sharp');
const fs = require('fs');

const SIZES = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192,
};

const INPUT_ICON = 'src/assets/new_icon.png';
const OUTPUT_DIR_BASE = 'android/app/src/main/res';

async function generateIcons() {
  console.log('Generando iconos para Android...');

  for (const density in SIZES) {
    const size = SIZES[density];
    const outputDir = `${OUTPUT_DIR_BASE}/mipmap-${density}`;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generar icono cuadrado
    const squareIconPath = `${outputDir}/ic_launcher.png`;
    await sharp(INPUT_ICON)
      .resize(size, size)
      .toFile(squareIconPath);
    console.log(`Creado: ${squareIconPath}`);

    // Generar icono redondo
    const roundIconPath = `${outputDir}/ic_launcher_round.png`;
    const roundMask = Buffer.from(
      `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
    );
    await sharp(INPUT_ICON)
      .resize(size, size)
      .composite([
        {
          input: roundMask,
          blend: 'dest-in',
        },
      ])
      .toFile(roundIconPath);
    console.log(`Creado: ${roundIconPath}`);
  }

  console.log('¡Iconos generados exitosamente!');
}

generateIcons().catch(err => {
  console.error('Error al generar los iconos:', err);
  process.exit(1);
});
