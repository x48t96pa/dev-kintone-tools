import esbuild from 'esbuild';
import { definePlugin } from 'esbuild-plugin-define';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = {
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  sourcemap: true,
  external: ['aws-sdk'],
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  plugins: [
    definePlugin({
      // プロジェクト内の process.envの置換 (ベタがきJSにする)
      process: {
        env: process.env,
      },
    }),
  ],
};

// Commander でコマンドライン引数を解析
program
  .name('esbuild-config')
  .description('esbuild wrapper for TypeScript projects')
  .requiredOption('--entryPoints <path>', 'Entry point file (relative to)')
  .option('--outfile <path>', 'Output file path')
  .option('--outdir <path>', 'Output directory path')
  .parse(process.argv);

const options = program.opts();

async function build() {
  try {
    const buildConfig = {
      ...baseConfig,
      entryPoints: [join(__dirname, options.entryPoints)],
    };

    if (options.outfile) {
      buildConfig.outfile = join(__dirname, options.outfile);
    } else if (options.outdir) {
      buildConfig.outdir = join(__dirname, options.outdir);
    } else {
      buildConfig.outdir = join(__dirname, 'dist');
    }

    await esbuild.build(buildConfig);
    console.log(`✓ Build completed: ${options.entryPoints} -> ${options.outfile || options.outdir || 'dist'}`);
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

build();