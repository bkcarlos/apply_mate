import { dbService } from '@/services/database';
import type { Company, InterviewProcess, InterviewRound } from '@/types';

// 测试公司数据
const testCompanies = [
  {
    name: '阿里巴巴',
    industry: '互联网',
    scale: '10000+人',
    website: 'https://www.alibaba.com'
  },
  {
    name: '腾讯',
    industry: '互联网',
    scale: '10000+人',
    website: 'https://www.tencent.com'
  },
  {
    name: '字节跳动',
    industry: '互联网',
    scale: '10000+人',
    website: 'https://www.bytedance.com'
  },
  {
    name: '美团',
    industry: '互联网',
    scale: '10000+人',
    website: 'https://www.meituan.com'
  },
  {
    name: '滴滴出行',
    industry: '互联网',
    scale: '1000-10000人',
    website: 'https://www.didiglobal.com'
  }
];

// 生成未来7天内的测试面试轮次
const generateTestData = async () => {
  try {
    console.log('开始创建测试数据...');
    
    // 初始化数据库
    await dbService.init();
    
    // 添加测试公司
    const companies: Company[] = [];
    for (const companyData of testCompanies) {
      const company = await dbService.addCompany(companyData);
      companies.push(company);
      console.log(`创建公司: ${company.name}`);
    }
    
    // 为每个公司创建面试流程
    const processes: InterviewProcess[] = [];
    for (const company of companies) {
      const process = await dbService.addInterviewProcess({
        companyId: company.id,
        position: '前端开发工程师',
        city: '北京',
        status: 'interviewing',
        conclusion: 'in_progress',
        sourceChannel: 'Boss直聘',
        expectedSalary: { min: 20000, max: 35000 }
      });
      processes.push(process);
      console.log(`创建面试流程: ${company.name} - ${process.position}`);
    }
    
    // 为每个流程创建未来7天内的面试轮次
    const now = new Date();
    const roundTypes: Array<{ type: 'phone' | 'video' | 'technical' | 'hr' | 'final', name: string }> = [
      { type: 'phone', name: '电话面试' },
      { type: 'video', name: '视频面试' },
      { type: 'technical', name: '技术面试' },
      { type: 'hr', name: 'HR面试' },
      { type: 'final', name: '终面' }
    ];
    
    for (let i = 0; i < processes.length; i++) {
      const process = processes[i];
      const company = companies[i];
      
      // 为每个流程创建1-2个未来面试轮次
      const numRounds = Math.random() > 0.5 ? 2 : 1;
      
      for (let roundNum = 1; roundNum <= numRounds; roundNum++) {
        // 生成未来1-7天内的随机时间
        const daysFromNow = Math.floor(Math.random() * 7) + 1;
        const scheduledAt = new Date(now);
        scheduledAt.setDate(now.getDate() + daysFromNow);
        
        // 设置随机时间 (9:00-18:00)
        const hour = Math.floor(Math.random() * 9) + 9; // 9-17
        const minute = Math.random() > 0.5 ? 0 : 30; // 整点或半点
        scheduledAt.setHours(hour, minute, 0, 0);
        
        const roundType = roundTypes[Math.floor(Math.random() * roundTypes.length)];
        
        const round = await dbService.addInterviewRound({
          processId: process.id,
          round: roundNum,
          type: roundType.type,
          scheduledAt,
          result: 'pending',
          interviewer: `${company.name}面试官${roundNum}`,
          location: Math.random() > 0.5 ? '视频会议' : `${company.name}总部`,
          notes: `${roundType.name} - 第${roundNum}轮`
        });
        
        console.log(`创建面试轮次: ${company.name} - 第${roundNum}轮 (${roundType.name}) - ${scheduledAt.toLocaleString()}`);
      }
    }
    
    console.log('测试数据创建完成！');
    return { companies, processes };
    
  } catch (error) {
    console.error('创建测试数据失败:', error);
    throw error;
  }
};

// 清理测试数据
const clearTestData = async () => {
  try {
    console.log('开始清理测试数据...');
    
    await dbService.init();
    
    // 获取所有数据
    const processes = await dbService.getAllInterviewProcesses();
    const companies = await dbService.getAllCompanies();
    const rounds = await dbService.getAllInterviewRounds();
    
    // 删除所有轮次
    for (const round of rounds) {
      await dbService.deleteInterviewRound(round.id);
    }
    
    // 删除所有流程
    for (const process of processes) {
      await dbService.deleteInterviewProcess(process.id);
    }
    
    // 删除所有公司
    for (const company of companies) {
      await dbService.deleteCompany(company.id);
    }
    
    console.log('测试数据清理完成！');
    
  } catch (error) {
    console.error('清理测试数据失败:', error);
    throw error;
  }
};

export { generateTestData, clearTestData }; 