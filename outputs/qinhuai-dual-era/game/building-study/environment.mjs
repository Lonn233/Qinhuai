export function applyEnvironment(p,{renderer,bloom,ambientLight,moonLight},enabled=true){
 if(renderer)renderer.toneMappingExposure=p.exposure;
 if(ambientLight)ambientLight.intensity=p.ambient;
 if(moonLight)moonLight.intensity=p.moon;
 if(bloom){bloom.strength=enabled?p.bloom:0;bloom.radius=p.bloomRadius;bloom.threshold=p.bloomThreshold;}
}
