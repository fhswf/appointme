const fs = require('fs');
const yaml = require('js-yaml');

const config = JSON.parse(fs.readFileSync(`package.json`, 'utf8'));
console.log("config: %j", config)

/* read arguments */
const args = process.argv.slice(2);

const git_sha = process.env.GITHUB_SHA;
const k8sConfig = yaml.load(fs.readFileSync(args[0], 'utf8'));

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
fs.writeFileSync(args[0], yaml.dump(k8sConfig));
