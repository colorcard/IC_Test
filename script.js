document.addEventListener('DOMContentLoaded', function() {
  const waferImageInput = document.getElementById('waferImageInput');
  const detectBtn = document.getElementById('detectBtn');
  const waferCanvas = document.getElementById('waferCanvas');
  const defectList = document.getElementById('defectList');
  const displaySection = document.getElementById('displaySection');
  let waferImage;
  let currentScale = 1;

  // 自适应调整 canvas 大小以适应电脑端显示
  function fitCanvasToContainer() {
    if (!waferImage) return;
    const containerWidth = displaySection.clientWidth - 40; // 考虑内边距
    const originalWidth = waferImage.width;
    const originalHeight = waferImage.height;
    if (originalWidth > containerWidth) {
      currentScale = containerWidth / originalWidth;
      waferCanvas.width = originalWidth * currentScale;
      waferCanvas.height = originalHeight * currentScale;
    } else {
      currentScale = 1;
      waferCanvas.width = originalWidth;
      waferCanvas.height = originalHeight;
    }
    const ctx = waferCanvas.getContext('2d');
    ctx.drawImage(waferImage, 0, 0, waferCanvas.width, waferCanvas.height);
  }

  // 调整窗口大小时重新计算canvas尺寸
  window.addEventListener('resize', fitCanvasToContainer);

  // 处理图片上传并显示在canvas上
  waferImageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
         waferImage = new Image();
         waferImage.onload = function() {
            fitCanvasToContainer();
         }
         waferImage.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  });

  // 模拟检测按钮点击事件
  detectBtn.addEventListener('click', function() {
    if (!waferImage) {
      alert('请先选择晶圆图片！');
      return;
    }
    simulateDetection();
  });

  // 模拟缺陷检测：随机生成缺陷点，并根据当前缩放比例绘制
  function simulateDetection() {
    const ctx = waferCanvas.getContext('2d');
    // 清除上次检测的痕迹，重新绘制图片
    ctx.drawImage(waferImage, 0, 0, waferCanvas.width, waferCanvas.height);
    
    const defects = [];
    const defectNum = Math.floor(Math.random() * 5) + 3; // 随机生成3-7个缺陷
    for (let i = 0; i < defectNum; i++) {
      const x = Math.random() * waferCanvas.width;
      const y = Math.random() * waferCanvas.height;
      defects.push({ id: i + 1, x, y, description: "缺陷" + (i + 1) + "描述" });
    }

    // 绘制红色圆圈标记缺陷位置
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    defects.forEach(defect => {
      ctx.beginPath();
      ctx.arc(defect.x, defect.y, 10, 0, 2 * Math.PI);
      ctx.stroke();
    });
    
    // 更新检测结果列表
    defectList.innerHTML = '';
    defects.forEach(defect => {
      const li = document.createElement('li');
      li.textContent = `缺陷 ${defect.id}: 坐标 (${Math.floor(defect.x)}, ${Math.floor(defect.y)}) - ${defect.description}`;
      defectList.appendChild(li);
    });
  }
});