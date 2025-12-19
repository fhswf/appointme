const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const pkgPath = path.join(process.cwd(), 'package.json');
const config = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
console.log("config: %j", config)

/* read arguments */
const args = process.argv.slice(2);

const git_sha = process.env.GITHUB_SHA;
const k8sConfigPath = args[0];
const k8sConfig = yaml.load(fs.readFileSync(k8sConfigPath, 'utf8'));

console.log('Patching k8s config...');

const image_name = k8sConfig.spec.template.spec.containers[0].image.split(':')[0];

if (!config.version) {
  k8sConfig.spec.template.spec.containers[0].image = `${image_name}:${git_sha}`;
}
else {
  k8sConfig.spec.template.spec.containers[0].image = `${image_name}:${config.version}`;
}
console.log(k8sConfig.spec.template.spec.containers[0].image)
/* write the new k8s config */
fs.writeFileSync(k8sConfigPath, yaml.dump(k8sConfig));
