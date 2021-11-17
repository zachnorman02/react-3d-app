import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Stage, useTexture } from '@react-three/drei'
import { Submarine } from '../components/Submarine';
import { Propeller } from '../components/Propeller';

export const Scene = ({currentColor, currentTexture, upKeyPressed}) => {
  const [colorMap, normalMap, roughnessMap, metalnessMap] = useTexture(currentTexture);
  const propellerMesh = useRef();

  useFrame(({ clock }) => {
    if (upKeyPressed) {
      propellerMesh.current.rotation.z = clock.getElapsedTime() * 3;
    }
  })
  return (
    <Stage intensity={1}>
      <Environment
          background={false}
          files={'UW_1.hdr'}
          path={'/'}
        />
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