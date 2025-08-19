// 中国省份坐标数据（用于备用显示）
const chinaProvinces = {
    "北京": { lat: 39.9042, lng: 116.4074 },
    "天津": { lat: 39.1040, lng: 117.1991 },
    "河北": { lat: 38.0437, lng: 114.5149 },
    "山西": { lat: 37.8570, lng: 112.5490 },
    "内蒙古": { lat: 40.8185, lng: 111.7662 },
    "辽宁": { lat: 41.2956, lng: 123.4315 },
    "吉林": { lat: 43.8868, lng: 125.3245 },
    "黑龙江": { lat: 45.8030, lng: 126.5350 },
    "上海": { lat: 31.2304, lng: 121.4737 },
    "江苏": { lat: 32.0617, lng: 118.7778 },
    "浙江": { lat: 30.2741, lng: 120.1551 },
    "安徽": { lat: 31.8612, lng: 117.2837 },
    "福建": { lat: 26.0745, lng: 119.2965 },
    "江西": { lat: 28.6743, lng: 115.9167 },
    "山东": { lat: 36.6512, lng: 117.1201 },
    "河南": { lat: 34.7466, lng: 113.6254 },
    "湖北": { lat: 30.5844, lng: 114.2998 },
    "湖南": { lat: 28.2278, lng: 112.9388 },
    "广东": { lat: 23.1291, lng: 113.2644 },
    "广西": { lat: 22.8154, lng: 108.3275 },
    "海南": { lat: 20.0174, lng: 110.3493 },
    "重庆": { lat: 29.5647, lng: 106.5507 },
    "四川": { lat: 30.5728, lng: 104.0668 },
    "贵州": { lat: 26.5783, lng: 106.7135 },
    "云南": { lat: 25.0400, lng: 102.7190 },
    "西藏": { lat: 29.6544, lng: 91.1322 },
    "陕西": { lat: 34.3416, lng: 108.9398 },
    "甘肃": { lat: 36.0611, lng: 103.8343 },
    "青海": { lat: 36.6230, lng: 101.7782 },
    "宁夏": { lat: 38.4723, lng: 106.2586 },
    "新疆": { lat: 43.7930, lng: 87.6177 }
};

// 简化的中国地图数据（SVG路径）
const chinaSVGMap = `
<svg viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <style>
            .province { fill: #f0f9ff; stroke: #e2e8f0; stroke-width: 1; }
            .province:hover { fill: #dbeafe; }
            .farm-point { r: 5; stroke: white; stroke-width: 2; }
            .farm-healthy { fill: #10b981; }
            .farm-warning { fill: #f59e0b; }
            .farm-danger { fill: #ef4444; }
        </style>
    </defs>
    
    <!-- 简化的中国轮廓 -->
    <path class="province" d="M100,200 L900,200 L900,600 L100,600 Z" />
    <text x="500" y="400" text-anchor="middle" fill="#6b7280" font-size="24">中国地图</text>
    <text x="500" y="430" text-anchor="middle" fill="#9ca3af" font-size="14">养殖场分布监控</text>
</svg>
`;

// 如果ECharts地图加载失败，使用这个简化版本
function renderSimpleMap() {
    const mapContainer = document.getElementById('chinaMap');
    mapContainer.innerHTML = `
        <div style="width: 100%; height: 100%; position: relative; background: #f8fafc;">
            ${chinaSVGMap}
            <div id="farmPoints" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
        </div>
    `;
    
    // 添加养殖场点位
    addFarmPoints();
}

function addFarmPoints() {
    const pointsContainer = document.getElementById('farmPoints');
    if (!pointsContainer) return;
    
    farmData.forEach(farm => {
        const point = document.createElement('div');
        point.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            cursor: pointer;
            transition: all 0.3s ease;
            left: ${(farm.lng - 70) * 8}px;
            top: ${(55 - farm.lat) * 8}px;
            background: ${farm.status === 'healthy' ? '#10b981' : farm.status === 'warning' ? '#f59e0b' : '#ef4444'};
        `;
        
        point.addEventListener('mouseenter', function() {
            point.style.transform = 'scale(1.5)';
            point.style.zIndex = '100';
            
            // 显示工具提示
            showTooltip(farm, point);
        });
        
        point.addEventListener('mouseleave', function() {
            point.style.transform = 'scale(1)';
            hideTooltip();
        });
        
        point.addEventListener('click', function() {
            showFarmDetails(farm);
        });
        
        pointsContainer.appendChild(point);
    });
}

function showTooltip(farm, element) {
    const tooltip = document.createElement('div');
    tooltip.id = 'mapTooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        margin-top: -10px;
    `;
    
    const statusText = {
        'healthy': '健康',
        'warning': '预警',
        'danger': '风险'
    };
    
    tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">${farm.name}</div>
        <div>状态: ${statusText[farm.status]}</div>
        <div>规模: ${farm.scale.toLocaleString()}只</div>
    `;
    
    const rect = element.getBoundingClientRect();
    const containerRect = document.getElementById('chinaMap').getBoundingClientRect();
    
    tooltip.style.left = (rect.left - containerRect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - containerRect.top) + 'px';
    
    document.getElementById('chinaMap').appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.getElementById('mapTooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 导出这些函数供map.js使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        chinaProvinces,
        renderSimpleMap,
        addFarmPoints
    };
}
