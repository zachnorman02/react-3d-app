import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import { Menu } from './components/Menu';
import { Scene } from './components/Scene';
import * as THREE from 'three';
import { smooth, rough, beatup } from './textures';

const FileChooser = ({ onChange }) => {
  const inputRef = useRef(null)

  const handleChange = () => {
    // Get the selected file
    const file = inputRef.current.files[0]

    // Call the onChange callback with the selected file
    onChange(file)
    console.log(file?.name)
  }

  return (
    <input
      type="file"
      aria-label="File input"
      ref={inputRef}
      onChange={handleChange}
    />
  )
}

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  const fragmentShader = `
    uniform sampler2D tDiffuse;
    uniform mat3 matrix;
    varying vec2 vUv;
    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      vec3 transformed = matrix * color;
      gl_FragColor = vec4(transformed, 1.0);
    }
  `

const App = () => {
  const crimson = new THREE.Color(0xdc143c);
  const teal = new THREE.Color(0x008080);
  const steelblue = new THREE.Color(0x4682b4);

  /** State */
  const [currentTexture, setCurrentTexture] = useState(smooth);
  const [currentColor, setCurrentColor] = useState(steelblue);

  /** 
   * @param {MouseEvent} event
   * @param {string} color - The color to change for the submarine
   */
  const handleColorChange = (event, color) => {
    event.preventDefault();
    if (color === 'crimson') {
      setCurrentColor(crimson);
    } else if (color === 'teal') {
      setCurrentColor(teal);
    } else if (color === 'steelblue') {
      setCurrentColor(steelblue);
    }
  };
  /** 
   * @param {MouseEvent} event
   * @param {string} texture - The texture to load for the submarine
   */
  const handleTextureChange = (event, texture) => {
    event.preventDefault();
    if (texture === 'smooth') {
      setCurrentTexture(smooth);
    } else if (texture === 'rough') {
      setCurrentTexture(rough);
    } else if (texture === 'beatup') {
      setCurrentTexture(beatup);
    }
  };

  const [file, setFile] = useState(undefined);
  const [kernelWidth, setKernelWidth] = useState(3);
  const [kernel1, setKernel1] = useState([1]);
  const [kernel2, setKernel2] = useState([1, 0, 0, 1]);
  const [kernel3, setKernel3] = useState([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const [kernel4, setKernel4] = useState([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]);

  const handleFileChange = (file) => {
    setFile(file)
  }

  const KernelBoxes = (width) => {
    const props = {
      1: {'kernel': kernel1, 'setter': setKernel1},
      2: {'kernel': kernel2, 'setter': setKernel2},
      3: {'kernel': kernel3, 'setter': setKernel3},
      4: {'kernel': kernel4, 'setter': setKernel4}
    }
    const boxes = []
    let kernel = props[width].kernel
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        boxes.push(
          <input 
            type='number' 
            value={kernel[i*width+j]} 
            aria-label={`kernel-${i}-${j}`} 
            onChange={e => {
              const val = parseInt(e.target.value)
              const tempList = [...kernel]
              tempList[i*width+j] = val
              props[width].setter(tempList)
            }}
          />
        )
      }
      boxes.push(<br/>)
    }
    return boxes;
  }

  const matrix = new THREE.Matrix3().set(...kernel3);
  console.log(matrix)
  const uniforms = useMemo(
    () => ({
      matrix: {
        value: matrix,
      },
    }),
    [matrix]
  );

  return (
    <div className="App h-screen" style={{ height: "100%" }}>
      <FileChooser onChange={(f) => handleFileChange(f)} />
      {file?.name ?? ""}
      <br />
      <label>
        Set kernel columns:
        <input
          type="number"
          value={kernelWidth}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if ([1, 2, 3, 4].includes(value)) {
              setKernelWidth(value);
            }
          }}
        />
      </label>
      <br />
      {KernelBoxes(kernelWidth)}
      <br />
      <Menu
        handleColorChange={handleColorChange}
        handleTextureChange={handleTextureChange}
      />
      <Canvas dpr={[1, 2]} camera={{ fov: 50 }}>
        <color attach="background" args={["#253B56"]} />
        <Suspense fallback={null}>
            <shaderMaterial
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              uniforms={uniforms}
            />
            <Scene
              currentTexture={currentTexture}
              currentColor={currentColor}
            />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}

export default App;