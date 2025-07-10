import type { SalaryInfo } from '../types'

// 薪资计算工具类
export class SalaryCalculator {
  
  /**
   * 计算年包最小值 (保底)
   * @param salary 薪资信息
   * @returns 年包最小值
   */
  static calculateMinTotal(salary: SalaryInfo): number {
    return salary.base * (12 + salary.guaranteedMonths)
  }

  /**
   * 计算年包典型值 (过去大多数情况)
   * @param salary 薪资信息
   * @returns 年包典型值
   */
  static calculateTypicalTotal(salary: SalaryInfo): number {
    return salary.base * (12 + salary.typicalMonths)
  }

  /**
   * 计算年包最大值
   * @param salary 薪资信息
   * @returns 年包最大值
   */
  static calculateMaxTotal(salary: SalaryInfo): number {
    return salary.base * (12 + salary.yearEndMonths)
  }

  /**
   * 获取薪资完整计算结果
   * @param salary 薪资信息
   * @returns 包含所有计算值的对象
   */
  static getFullCalculation(salary: SalaryInfo) {
    return {
      base: salary.base,
      yearEndMonths: salary.yearEndMonths,
      guaranteedMonths: salary.guaranteedMonths,
      typicalMonths: salary.typicalMonths,
      minTotal: this.calculateMinTotal(salary),
      typicalTotal: this.calculateTypicalTotal(salary),
      maxTotal: this.calculateMaxTotal(salary)
    }
  }

  /**
   * 格式化薪资显示
   * @param amount 金额
   * @returns 格式化后的字符串
   */
  static formatSalary(amount: number): string {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}万`
    }
    return amount.toLocaleString()
  }

  /**
   * 获取薪资范围显示文本
   * @param salary 薪资信息
   * @returns 薪资范围文本
   */
  static getSalaryRangeText(salary: SalaryInfo): string {
    const calc = this.getFullCalculation(salary)
    const min = this.formatSalary(calc.minTotal)
    const typical = this.formatSalary(calc.typicalTotal)
    const max = this.formatSalary(calc.maxTotal)
    
    return `${min} - ${typical} - ${max}`
  }

  /**
   * 创建默认薪资信息
   * @param base 基础月薪
   * @returns 默认薪资信息
   */
  static createDefault(base: number = 0): SalaryInfo {
    return {
      base,
      yearEndMonths: 3, // 默认3个月年终
      guaranteedMonths: 1, // 默认保底1个月
      typicalMonths: 2 // 默认大多数情况2个月
    }
  }

  /**
   * 验证薪资信息的合理性
   * @param salary 薪资信息
   * @returns 验证结果
   */
  static validate(salary: SalaryInfo): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (salary.base <= 0) {
      errors.push('基础月薪必须大于0')
    }
    
    if (salary.guaranteedMonths < 0) {
      errors.push('保底月数不能为负数')
    }
    
    if (salary.typicalMonths < salary.guaranteedMonths) {
      errors.push('大多数情况月数不能小于保底月数')
    }
    
    if (salary.yearEndMonths < salary.typicalMonths) {
      errors.push('年终月数不能小于大多数情况月数')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// 薪资对比工具
export class SalaryComparator {
  
  /**
   * 对比两个薪资
   * @param salary1 薪资1
   * @param salary2 薪资2
   * @returns 对比结果
   */
  static compare(salary1: SalaryInfo, salary2: SalaryInfo) {
    const calc1 = SalaryCalculator.getFullCalculation(salary1)
    const calc2 = SalaryCalculator.getFullCalculation(salary2)
    
    return {
      salary1: calc1,
      salary2: calc2,
      minDiff: calc2.minTotal - calc1.minTotal,
      typicalDiff: calc2.typicalTotal - calc1.typicalTotal,
      maxDiff: calc2.maxTotal - calc1.maxTotal,
      minPercentage: ((calc2.minTotal - calc1.minTotal) / calc1.minTotal * 100),
      typicalPercentage: ((calc2.typicalTotal - calc1.typicalTotal) / calc1.typicalTotal * 100),
      maxPercentage: ((calc2.maxTotal - calc1.maxTotal) / calc1.maxTotal * 100)
    }
  }
}
