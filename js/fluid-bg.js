/* ============================================
   Liquid Flow Background — WebGL Shader
   Creates a flowing, rippling effect on an image
   ============================================ */

function initFluidBackground(canvasId, imageSrc) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    // Fallback: just show the image as a static background
    canvas.style.display = 'none';
    canvas.parentElement.style.backgroundImage = `url(${imageSrc})`;
    canvas.parentElement.style.backgroundSize = 'cover';
    canvas.parentElement.style.backgroundPosition = 'center';
    return;
  }

  // Vertex shader
  const vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  // Fragment shader — flowing liquid distortion
  const fsSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
      vec2 uv = v_texCoord;

      // Multiple layers of slow, organic sine wave distortion
      float t = u_time * 0.15;

      // Large slow waves
      float wave1 = sin(uv.y * 3.0 + t * 0.7) * 0.008;
      float wave2 = cos(uv.x * 2.5 + t * 0.5) * 0.006;

      // Medium organic ripples
      float wave3 = sin(uv.x * 5.0 + uv.y * 3.0 + t * 0.9) * 0.004;
      float wave4 = cos(uv.y * 4.0 - uv.x * 2.0 + t * 0.6) * 0.003;

      // Subtle fast shimmer
      float wave5 = sin(uv.x * 8.0 + uv.y * 6.0 + t * 1.8) * 0.0015;
      float wave6 = cos(uv.x * 7.0 - uv.y * 5.0 + t * 1.5) * 0.0012;

      // Combine distortions
      vec2 distortion = vec2(
        wave1 + wave3 + wave5,
        wave2 + wave4 + wave6
      );

      vec2 distortedUV = uv + distortion;

      // Clamp to avoid edge artifacts
      distortedUV = clamp(distortedUV, 0.001, 0.999);

      vec4 color = texture2D(u_image, distortedUV);

      // Subtle brightness variation for liquid sheen
      float sheen = sin(uv.x * 4.0 + uv.y * 3.0 + t * 1.2) * 0.03 + 1.0;
      color.rgb *= sheen;

      gl_FragColor = color;
    }
  `;

  // Compile shader
  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compileShader(vsSource, gl.VERTEX_SHADER);
  const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error');
    return;
  }
  gl.useProgram(program);

  // Fullscreen quad
  const positions = new Float32Array([
    -1, -1,  1, -1,  -1, 1,
    -1,  1,  1, -1,   1, 1
  ]);
  const texCoords = new Float32Array([
    0, 1,  1, 1,  0, 0,
    0, 0,  1, 1,  1, 0
  ]);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  const texLoc = gl.getAttribLocation(program, 'a_texCoord');
  gl.enableVertexAttribArray(texLoc);
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const resLoc = gl.getUniformLocation(program, 'u_resolution');

  // Load texture
  const texture = gl.createTexture();
  const image = new Image();
  image.crossOrigin = 'anonymous';

  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Start animation
    requestAnimationFrame(render);
  };

  image.src = imageSrc;

  // Handle resize
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);

  // Animation loop
  let startTime = Date.now();
  let animId;

  function render() {
    const elapsed = (Date.now() - startTime) / 1000;
    gl.uniform1f(timeLoc, elapsed);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animId = requestAnimationFrame(render);
  }

  // Pause when not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTime = Date.now() - (startTime ? (Date.now() - startTime) : 0);
        if (!animId) requestAnimationFrame(render);
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  });
  observer.observe(canvas);
}
