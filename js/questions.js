// 题库数据（直接内嵌，无需 fetch）
const QUESTION_DATA = [
    {
        "id": 1,
        "title": "猜数字游戏（进阶）",
        "description": "编写一个猜数字游戏：程序随机生成一个 1-50 之间的整数，让用户反复猜，猜对时输出“恭喜！猜对了！”并结束游戏，同时显示猜测次数。\n\n提示：使用 random.randint，while True 和 break。",
        "initialCode": "import random\nsecret = random.randint(1, 50)\ncount = 0\nprint(\"猜数字游戏（1-50）\")\nwhile True:\n    guess = int(input(\"请输入你的猜测: \"))\n    count += 1\n    if guess == secret:\n        print(f\"恭喜！猜对了！共猜了{count}次\")\n        break\n    elif guess > secret:\n        print(\"猜大了\")\n    else:\n        print(\"猜小了\")"
    },
    {
        "id": 2,
        "title": "while 循环求和",
        "description": "计算 1+2+3+...+100 的和，并打印结果。\n\n提示：使用 while 循环和累加变量。",
        "initialCode": "total = 0\ni = 1\nwhile i <= 100:\n    total = total + i\n    i = i + 1\nprint(total)"
    },
    {
        "id": 3,
        "title": "生成双色球彩票号码",
        "description": "模拟生成一注双色球号码：从1-33中随机选6个不重复的红球，从1-16中随机选1个蓝球。\n\n提示：使用 random.sample(range(1,34), k=6) 生成红球，random.randint(1,16) 生成蓝球。",
        "initialCode": "import random\nred = random.sample(range(1, 34), k=6)\nblue = random.randint(1, 16)\nprint(\"红球号码：\", sorted(red))\nprint(\"蓝球号码：\", blue)"
    },
    {
        "id": 4,
        "title": "模拟掷骰子统计",
        "description": "模拟掷一个骰子100次，统计每个面（1-6）出现的次数。\n\n提示：使用 random.randint(1,6) 模拟掷骰子，用列表记录次数，最后输出。",
        "initialCode": "import random\ncounts = [0, 0, 0, 0, 0, 0]\nfor _ in range(100):\n    roll = random.randint(1, 6)\n    counts[roll-1] += 1\nfor i in range(6):\n    print(f\"点数 {i+1}: {counts[i]} 次\")"
    },
    {
        "id": 5,
        "title": "百元买百鸡问题",
        "description": "公鸡每只2元，母鸡每只3元，小鸡每只0.5元。用100元买100只鸡，求解所有可能的购买方案。\n\n提示：使用嵌套循环，注意范围：公鸡最多33只，母鸡最多33只，小鸡数量 = 100 - 公鸡 - 母鸡。",
        "initialCode": "for x in range(0, 34):  # 公鸡数量范围\n    for y in range(0, 51):  # 母鸡数量范围\n        z = 100 - x - y      # 小鸡数量\n        if z >= 0 and (2 * x + 3 * y + z * 0.5 == 100):\n            print(f\"公鸡: {x}, 母鸡: {y}, 小鸡: {z}\")"
    },
    {
        "id": 6,
        "title": "判断水仙花数",
        "description": "找出所有三位数中的水仙花数（各位数字立方和等于该数本身）。\n\n提示：使用 for 循环遍历 100~999，分解百位、十位、个位，判断立方和是否等于原数。",
        "initialCode": "for num in range(100, 1000):\n    bai = num // 100\n    shi = (num // 10) % 10\n    ge = num % 10\n    if bai**3 + shi**3 + ge**3 == num:\n        print(num)"
    },
    {
        "id": 7,
        "title": "输出九九乘法表",
        "description": "使用嵌套的 for 循环打印九九乘法表（下三角形式）。\n\n提示：外层循环控制行，内层循环控制列，使用 end='\\t' 对齐。",
        "initialCode": "for i in range(1, 10):\n    for j in range(1, i + 1):\n        print(f\"{i} * {j} = {i * j}\", end=\"\\t\")\n    print()"
    },
    {
        "id": 8,
        "title": "找出特定范围内的数字",
        "description": "输出 1~100 中能被 7 整除但不能被 5 整除的所有数字。\n\n提示：使用 for 循环和 if 条件判断。",
        "initialCode": "for i in range(1, 101):\n    if i % 7 == 0 and i % 5 != 0:\n        print(i, end=\" \")"
    },
    {
        "id": 9,
        "title": "打印星号三角形",
        "description": "输入一个奇数 N，打印一个由星号组成的等边三角形。\n\n例如输入 5，输出：\n  *\n ***\n*****\n\n提示：使用 input() 获取奇数，循环控制空格和星号数量。",
        "initialCode": "n = int(input(\"请输入一个奇数: \"))\nfor i in range(1, n + 1, 2):\n    print(\" \" * ((n - i) // 2) + \"*\" * i)"
    },
    {
        "id": 10,
        "title": "输出素数",
        "description": "找出并输出 100 以内的所有素数（质数）。\n\n提示：使用 for 循环判断每个数能否被 2 到 sqrt(该数) 之间的整数整除。",
        "initialCode": "for num in range(2, 101):\n    is_prime = True\n    for i in range(2, int(num**0.5) + 1):\n        if num % i == 0:\n            is_prime = False\n            break\n    if is_prime:\n        print(num, end=\" \")"
    }
];