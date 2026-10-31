// Shared by world, near-detail and book viewers; supplied source stays untouched.
export function chrysanthemumAssetUrl(mode='current') {
  if(!['current','five','half','original'].includes(mode))throw new RangeError('Unknown chrysanthemum quality: '+mode);
  return new URL(`./assets/chrysanthemum-four-faces/${mode}.glb?v=chrysanthemum-four-faces-20261022`,import.meta.url).href;
}
