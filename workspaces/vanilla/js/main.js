(() => {
  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let isEnterAnotherScene = false;

  // 부드러운 애니메이션 처리 변수(가속)
  let acc = 0.16180339887;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objects: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext('2d'),
        videoImages: [],
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
      },
    },
    {
      // 1
      type: "normal",
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objects: {
        container: document.querySelector("#scroll-section-1"),
        content: document.querySelector("#scroll-section-1 .description"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objects: {
        container: document.querySelector("#scroll-section-2"),
        messageA: document.querySelector("#scroll-section-2 .a"),
        messageB: document.querySelector("#scroll-section-2 .b"),
        messageC: document.querySelector("#scroll-section-2 .c"),
        pinB: document.querySelector("#scroll-section-2 .b .pin"),
        pinC: document.querySelector("#scroll-section-2 .c .pin"),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext('2d'),
        videoImages: [],
      },
      values: {
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
        messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
        messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
        messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
        pinB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        pinC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        pinB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        pinC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        videoImageCount: 960,
        imageSequence: [0, 959],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objects: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector(".canvas-caption"),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext('2d'),
        imagesPath: [
          `./images/blend-image-1.jpg`,
          `./images/blend-image-2.jpg`,
        ],
        images: [],
      },
      values: {
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        rectStartY: 0,
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        caption_opacity: [0, 1, { start: 0, end: 0 }],
        caption_translateY: [20, 0, { start: 0, end: 0 }],
      },
    },
  ];

  function setCanvasImages() {
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      let imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objects.videoImages.push(imgElem);
    }
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      let imgElem = new Image();
      imgElem.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objects.videoImages.push(imgElem);
    }
    for (let i = 0; i < sceneInfo[3].objects.imagesPath.length; i++) {
      let imgElem = new Image();
      imgElem.src = sceneInfo[3].objects.imagesPath[i];
      sceneInfo[3].objects.images.push(imgElem);
    }
  }

  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
    }
  }

  /** Set scrollHeight per section */
  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objects.container.offsetHeight;
      }
      sceneInfo[i].objects.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    // Canvas
    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objects.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objects.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  }

  function calcValues(values, currentYOffset) {
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // [start, end] 구간이 있는 values를 인수로 받았을 경우
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      const partScrollRatio =
        (currentYOffset - partScrollStart) / partScrollHeight;

      // 자기 영역이 아닌 곳에서는 동작하지 않게 분기 처리
      // 상위 함수에서 분기 처리해서 처리하지 않는 부분
      if (partScrollStart > currentYOffset) return values[0];
      if (currentYOffset > partScrollEnd) return values[1];

      return partScrollRatio * (values[1] - values[0]) + values[0];
    } else {
      return scrollRatio * (values[1] - values[0]) + values[0];
    }
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objects;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        // console.log('0 play');
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        // CANVAS
        // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

        break;

      case 2:
        // console.log('2 play');
        if (scrollRatio <= 0.25) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.57) {
          // in
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        } else {
          // out
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        }

        if (scrollRatio <= 0.83) {
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        }

        if (scrollRatio < 0.5) {
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
        } else {
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
        }

        // 부드러운 이미지 처리로 인한 주석처리
        // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

        //! 2 to 3 구간에서 canvas가 갑자기 나타나는 현상이 부자연스러워 미리 canvas를 그리는 작업
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objects;
          const values = sceneInfo[3].values;

          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          const canvasScaleRatio = widthRatio > heightRatio ? widthRatio : heightRatio;

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = 'white';
          objs.context.drawImage(objs.images[0], 0, 0);

          const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
          const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          // Canvas 안에 그릴 좌우 직사각형
          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          // 좌우 흰색 박스 그리기
          objs.context.fillRect(
            parseInt(values.rect1X[0]), // x
            0, // y
            parseInt(whiteRectWidth), // width
            objs.canvas.height // heightNum
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
        }

        break;

      case 3:
        // console.log('3 play');
        let step = 0;
        // 가로와 세로 크기가 윈도우에 가득차게 하기 위해 이 지점에서 처리
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        const canvasScaleRatio = widthRatio > heightRatio ? widthRatio : heightRatio;

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = 'white';
        objs.context.drawImage(objs.images[0], 0, 0);

        // Canvas 크기에 맞춰 가정한 innerWidth와 innerHeight
        // 브라우저의 스크롤바 너비가 잡힐 경우 document.body로 접근해서 너비를 구해야 한다.
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
        // const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        // Blend Canvas Animation Scroll Position Y
        // 처음 한 번만 값이 할당되게끔 설정
        if (!values.rectStartY) {
          // getBoundingClientRect로 처리할 경우 스크롤을 빠르게 했을 때 다른 값이 할당된다.
          // values.rectStartY = objs.canvas.getBoundingClientRect().top;

          // 또한 부모의 position이 relative일 때 상대적인 offset이 나오며, 기본(static)적으로는 문서 상단부터의 offset이 나온다.
          // CANVAS의 크기가 JS 상에서 조정되었기 때문에 문서 상에서의 위치와 다르기 때문에 scale 조정을 다시 해야 한다.
          // values.rectStartY = objs.canvas.OffsetTop;

          // A: 부모 상단으로부터의 offsetTop
          // B: Canvas의 원래 높이
          // C = B * ratio: window 크기에 따라 조정된 Canvas 높이
          // A + (B - C) / 2
          values.rectStartY =
            objs.canvas.offsetTop
            + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          values.rect1X[2].start = values.rectStartY / 2 / scrollHeight;
          values.rect2X[2].start = values.rectStartY / 2 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        // Canvas 안에 그릴 좌우 직사각형
        const whiteRectWidth = recalculatedInnerWidth * 0.15;
        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        // 좌우 흰색 박스 그리기
        // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
        // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, currentYOffset)), // x
          0, // y
          parseInt(whiteRectWidth), // width
          objs.canvas.height); // height
        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height);

        if (scrollRatio < values.rect1X[2].end) {
          // 캔버스가 화면 상단에 닿지 않았다면
          step = 1;
          objs.canvas.classList.remove('sticky');
        } else {
          step = 2;
          objs.canvas.classList.add('sticky');
          objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2; // 20%

          const blendHeight = calcValues(values.blendHeight, currentYOffset);
          objs.context.drawImage(
            objs.images[1],
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
          );

          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            values.canvas_scale[1] = document.body.offsetWidth / (objs.canvas.width * 1.5);
            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

            objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
            objs.canvas.style.marginTop = 0;
          }

          // Canvas가 다 축소된 시점부터 sticky 설정을 제거하고 보통 스크롤 영역이 등장하게끔 설정
          // 스크롤을 쭉쭉 내리면서 와서 position fixed를 제거하면 이미 문서는 한참 내려왔기 때문에
          // 동시에 margin top을 주어서 문서가 이어지게 설정한다.
          if (
            scrollRatio > values.canvas_scale[2].end &&
            values.canvas_scale[2].end > 0
          ) {
            objs.canvas.classList.remove('sticky');
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

            values.caption_opacity[2].start = values.canvas_scale[2].end;
            values.caption_opacity[2].end = values.caption_opacity[2].start + 0.1;
            objs.canvasCaption.style.opacity = calcValues(values.caption_opacity, currentYOffset);
            values.caption_translateY[2].start = values.caption_opacity[2].start;
            values.caption_translateY[2].end = values.caption_opacity[2].end;
            objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.caption_translateY, currentYOffset)}%, 0)`;

          }
        }

        break;
    }
  }

  /** Find currentScene when it is scrolled */
  function scrollLoop() {
    isEnterAnotherScene = false;

    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // yOffset -> delayedYOffset
    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      isEnterAnotherScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    // yOffset -> delayedYOffset
    if (delayedYOffset < prevScrollHeight) {
      isEnterAnotherScene = true;
      // 간혹 yOffset 값이 음수까지 되는 브라우저가 존재해 index underflow가 발생하지 않게 예방
      if (currentScene == 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    // Scene이 바뀌는 부분에서는 경계값으로 인한 여러 위험요소를 피하기 위해 함수를 강제 종료
    if (isEnterAnotherScene) return;
    playAnimation();
  }

  // 부드러운 애니메이션 처리 함수
  function loop() {

    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!isEnterAnotherScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const objs = sceneInfo[currentScene].objects;
        const values = sceneInfo[currentScene].values;
        
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        if (objs.videoImages[sequence])
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  // load와 DOMContentLoaded는 거의 유사하나 자세한 차이는 검색하자
  // window.addEventListener('load', setLayout);
  window.addEventListener("DOMContentLoaded", () => {
    setLayout();
    sceneInfo[0].objects.context.drawImage(sceneInfo[0].objects.videoImages[0], 0, 0);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) setLayout();
    // 문서 중간에서 브라우저를 리사이즈 했을 때를 대비한 관련 변수 초기화
    sceneInfo[3].values.rectStartY = 0;
  });
  // 모바일 기기에서 가로/세로 모드로 변경할 때
  window.addEventListener("orientationchange", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
    checkMenu();
    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });
  setCanvasImages();

})();
