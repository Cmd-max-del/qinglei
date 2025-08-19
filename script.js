// 全局变量
let currentSlide = 0;
const totalSlides = 5;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeNavigation();
    initializeForm();
    initializeAnimations();
    initializeChart();
});

// 初始化轮播图
function initializeCarousel() {
    const slides = document.querySelectorAll('.tech-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // 显示当前幻灯片
    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // 更新所有点的状态
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // 显示当前幻灯片和点
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // 事件监听器
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // 点击点导航
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // 自动播放
    setInterval(nextSlide, 5000);

    // 初始化显示第一张幻灯片
    showSlide(0);
}

// 初始化导航
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // 汉堡菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 点击导航链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// 初始化表单
function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // 显示提交成功消息
            showMessage('感谢您的留言！我们会尽快与您联系。', 'success');
            
            // 重置表单
            contactForm.reset();
        });
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // 添加样式
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    // 添加到页面
    document.body.appendChild(messageDiv);

    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// 平滑滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// 初始化动画
function initializeAnimations() {
    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll(`
        .team-member,
        .tech-slide,
        .product-card,
        .stat-card,
        .opportunity-item,
        .mode-card,
        .support-item,
        .contact-item
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 初始化图表
function initializeChart() {
    const canvas = document.getElementById('marketChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 简单的饼图数据
    const data = [
        { label: '疫苗市场', value: 40, color: '#2563eb' },
        { label: '检测试剂', value: 30, color: '#10b981' },
        { label: '诊断服务', value: 20, color: '#f59e0b' },
        { label: '其他', value: 10, color: '#8b5cf6' }
    ];

    // 绘制饼图
    function drawPieChart() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        let currentAngle = -Math.PI / 2; // 从顶部开始

        data.forEach(item => {
            const sliceAngle = (item.value / 100) * 2 * Math.PI;
            
            // 绘制扇形
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = item.color;
            ctx.fill();
            
            // 绘制标签
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
            ctx.fillStyle = '#374151';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.label}`, labelX, labelY);
            ctx.fillText(`${item.value}%`, labelX, labelY + 15);
            
            currentAngle += sliceAngle;
        });

        // 绘制中心标题
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('市场分布', centerX, centerY - 10);
        ctx.font = '12px Inter';
        ctx.fillText('(单位: %)', centerX, centerY + 10);
    }

    // 绘制图表
    drawPieChart();
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 优化滚动性能
const optimizedScrollHandler = throttle(() => {
    // 滚动处理逻辑
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// 数字动画效果
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 当统计数字出现在视口时启动动画
function initializeStatAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                
                if (number > 0) {
                    entry.target.animated = true;
                    animateNumber(entry.target, 0, number, 2000);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => statObserver.observe(el));
}

// 页面加载完成后初始化统计动画
document.addEventListener('DOMContentLoaded', () => {
    initializeStatAnimations();
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

document.head.appendChild(style);
