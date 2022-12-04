import { useRef } from 'react';
import { Stage, useTexture } from '@react-three/drei'
import { Submarine } from '../components/Submarine';
import { Propeller } from '../components/Propeller';

export const Scene = ({currentColor, currentTexture, upKeyPressed}) => {
  const [colorMap, normalMap, roughnessMap, metalnessMap] = useTexture(currentTexture);
  const propellerMesh = useRef();

  return (
    <Stage adjustCamera intensity={1}>
      <mesh>
        <Submarine 
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          metalnessMap={metalnessMap} 
          currentColor={currentColor}
          currentTexture={currentTexture} />
      </mesh>
      <mesh ref={propellerMesh}>
        <Propeller 
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          metalnessMap={metalnessMap} 
          currentColor={currentColor}
          currentTexture={currentTexture} />
      </mesh>
    </Stage>
  )
}