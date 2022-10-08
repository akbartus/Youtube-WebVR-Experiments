(() => {
  if ("undefined" == typeof AFRAME)
    throw new Error(
      "Component attempted to register before AFRAME was available."
    );
  AFRAME.registerShader("chromakey", {
    schema: {
      src: { type: "map" },
      color: {
        default: { x: 0.1, y: 0.9, z: 0.2 },
        type: "vec3",
        is: "uniform",
      },
      transparent: { default: !0, is: "uniform" },
    },
    init: function (e) {
      var r = new THREE.VideoTexture(e.src);
      (r.minFilter = THREE.LinearFilter),
        (this.material = new THREE.ShaderMaterial({
          uniforms: {
            color: { type: "c", value: e.color },
            myTexture: { type: "t", value: r },
          },
          vertexShader: this.vertexShader,
          fragmentShader: this.fragmentShader,
        }));
    },
    update: function (e) {
      (this.material.color = e.color),
        (this.material.src = e.src),
        (this.material.transparent = e.transparent);
    },
    vertexShader: [
      "varying vec2 vUv;",
      "void main(void)",
      "{",
      "vUv = uv;",
      "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
      "gl_Position = projectionMatrix * mvPosition;",
      "}",
    ].join("\n"),
    fragmentShader: [
      "uniform sampler2D myTexture;",
      "uniform vec3 color;",
      "varying vec2 vUv;",
      "void main(void)",
      "{",
      "vec3 tColor = texture2D( myTexture, vUv ).rgb;",
      "float a = (length(tColor - color) - 0.5) * 7.0;",
      "gl_FragColor = vec4(tColor, a);",
      "}",
    ].join("\n"),
  });
})();
