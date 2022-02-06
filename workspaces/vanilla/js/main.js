(() => {

  let yOffset = 0;
  let prevScrollHeight = 0;
  let currentScene = 0;
  let isEnterAnotherScene = false;

  const sceneInfo = [
    {
      id: 0,
      type: 'sticky',
      heightNum: 5, // ex) window height의 5배로 scrollHeight 설정
      scrollHeight: 0,
      objects: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      /** 각 요소들이 어떤 animation을 나타내는지 정리 */
      values: {
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      },
    },
    {
      id: 1,
      type: 'normal',
      heightNum: 5,
      scrollHeight: 0,
      objects: { container: document.querySelector('#scroll-section-1') },
    },
    {
      id: 2,
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objects: { container: document.querySelector('#scroll-section-2') },
    },
    {
      id: 3,
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objects: { container: document.querySelector('#scroll-section-3') },
    },
  ];

  /** Set scrollHeight per section */
  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
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
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {

    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // [start, end] 구간이 있는 values를 인수로 받았을 경우
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      const partScrollRatio = (currentYOffset - partScrollStart) / partScrollHeight;

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

    const objects = sceneInfo[currentScene].objects;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        let middleValue = (values.messageA_opacity_out[2].start + values.messageA_opacity_in[2].end) / 2;
        let isMiddle = scrollRatio < middleValue;

        objects.messageA.style.opacity = isMiddle
          ? calcValues(values.messageA_opacity_in, currentYOffset)
          : calcValues(values.messageA_opacity_out, currentYOffset);
        objects.messageA.style.transform = `translateY(${
          isMiddle
            ? calcValues(values.messageA_translateY_in, currentYOffset)
            : calcValues(values.messageA_translateY_out, currentYOffset)
        }%)`;

        const messageB_opacity_in = calcValues(values.messageB_opacity_in, currentYOffset);
        objects.messageB.style.opacity = messageB_opacity_in;
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
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

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      isEnterAnotherScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      isEnterAnotherScene = true;
      // 간혹 yOffset 값이 음수까지 되는 브라우저가 존재해 index underflow가 발생하지 않게 예방
      if (currentScene == 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // Scene이 바뀌는 부분에서는 경계값으로 인한 여러 위험요소를 피하기 위해 함수를 강제 종료
    if (isEnterAnotherScene) return;
    playAnimation();

  }

  // load와 DOMContentLoaded는 거의 유사하나 자세한 차이는 검색하자
  // window.addEventListener('load', setLayout);
  window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener('resize', setLayout);
  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

})();
