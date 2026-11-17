export interface CodeLine {
  line: number;
  code: string;
  role: string;
  explanation: string;
}

export interface ConstructorField {
  key: string;
  label: string;
  type: 'text' | 'number';
  defaultValue: string;
  placeholder: string;
  min?: number;
  max?: number;
}

export interface MethodParam {
  key: string;
  label: string;
  type: 'number' | 'text';
  defaultValue: string;
  min?: number;
  max?: number;
}

export interface MethodExecutionResult {
  nextAttrs: Record<string, string | number | boolean>;
  consoleOutput: string;
  callExpression: string;
  selfTrace: string;
  highlightLine: number;
}

export interface ClassMethodDef {
  name: string;
  label: string;
  description: string;
  highlightLine: number;
  params: MethodParam[];
  execute: (
    instanceName: string,
    attrs: Record<string, string | number | boolean>,
    classAttrValue: string,
    paramValues: Record<string, string>
  ) => MethodExecutionResult;
}

export interface ClassPreset {
  id: 'pet' | 'bank' | 'coffee';
  className: string;
  title: string;
  analogy: string;
  varPrefix: string;
  classAttrName: string;
  classAttrDefault: string;
  classAttrDescription: string;
  meterKey: string;
  meterLabel: string;
  meterUnit: string;
  meterMax: number;
  codeLines: CodeLine[];
  constructorFields: ConstructorField[];
  methods: ClassMethodDef[];
  initialInstances: Array<{
    varName: string;
    args: Record<string, string>;
  }>;
}

export const CLASS_PRESETS: ClassPreset[] = [
  {
    id: 'pet',
    className: 'Pet',
    title: '電子寵物 Pet',
    analogy: '類別就像寵物基因圖譜，每個實體都有自己獨立的名字與體力，但共享同一個物種標籤。',
    varPrefix: 'pet',
    classAttrName: 'species',
    classAttrDefault: 'Digital Companion',
    classAttrDescription: '類別屬性：所有 Pet 實例共用同一份預設物種名稱，除非單一實例另外覆寫。',
    meterKey: 'energy',
    meterLabel: '體力值',
    meterUnit: '%',
    meterMax: 100,
    codeLines: [
      {
        line: 1,
        code: 'class Pet:',
        role: '類別定義',
        explanation: '使用 class 關鍵字宣告名為 Pet 的設計藍圖（命名慣例採用大駝峰 PascalCase）。',
      },
      {
        line: 2,
        code: '    species = "Digital Companion"',
        role: '類別屬性 (Class Attribute)',
        explanation: '定義在方法之外的變數屬於整個類別，所有產生的實例都會共享這個預設值。',
      },
      {
        line: 3,
        code: '',
        role: '空白分隔行',
        explanation: 'PEP 8 風格建議在類別屬性與方法之間保留空行，提升程式可讀性。',
      },
      {
        line: 4,
        code: '    def __init__(self, name, energy=80):',
        role: '建構方法 (Constructor)',
        explanation: '每次呼叫 Pet(...) 建立新物件時，Python 會自動執行 __init__，並將新物件作為 self 傳入。',
      },
      {
        line: 5,
        code: '        self.name = name',
        role: '實例屬性綁定',
        explanation: '將傳入的 name 寫入「當前物件 (self)」的專屬字典中，每個物件各自擁有獨立的 name。',
      },
      {
        line: 6,
        code: '        self.energy = max(0, min(100, energy))',
        role: '實例屬性初始化',
        explanation: '設定初始體力值並限制在 0 到 100 之間，確保物件剛誕生時處於合理狀態。',
      },
      {
        line: 7,
        code: '        self.mood = "好奇"',
        role: '預設實例狀態',
        explanation: '不一定要從外部傳參，也能在 __init__ 中為每個實例設定起始狀態。',
      },
      {
        line: 8,
        code: '',
        role: '空白分隔行',
        explanation: '方法之間空一行是 Python 標準排版規範。',
      },
      {
        line: 9,
        code: '    def feed(self, amount=20):',
        role: '實例方法 (Instance Method)',
        explanation: '第一個參數必須是 self，讓方法知道要替「哪一隻寵物」增加體力。',
      },
      {
        line: 10,
        code: '        self.energy = min(100, self.energy + amount)',
        role: '修改物件狀態',
        explanation: '透過 self.energy 讀取並更新該實例的體力，不會影響到其他 Pet 物件。',
      },
      {
        line: 11,
        code: '        self.mood = "滿足"',
        role: '狀態連動更新',
        explanation: '方法可以同時更新多個實例屬性，維持物件內部狀態一致。',
      },
      {
        line: 12,
        code: '        return f"{self.name} 吃飽了，體力 {self.energy}%"',
        role: '回傳執行結果',
        explanation: '使用 f-string 讀取 self.name 與 self.energy 回傳字串。',
      },
      {
        line: 13,
        code: '',
        role: '空白分隔行',
        explanation: '分隔不同方法定義。',
      },
      {
        line: 14,
        code: '    def play(self):',
        role: '互動行為方法',
        explanation: '定義寵物的玩耍行為，會檢查當前體力是否足夠。',
      },
      {
        line: 15,
        code: '        if self.energy < 25:',
        role: '狀態條件判斷',
        explanation: '物件的方法會依據自身的屬性狀態做出不同決策。',
      },
      {
        line: 16,
        code: '            self.mood = "疲倦"',
        role: '狀態切換',
        explanation: '體力不足時切換心情為疲倦，並拒絕消耗體力。',
      },
      {
        line: 17,
        code: '            return f"{self.name} 太累了，需要先休息或餵食"',
        role: '保護性回傳',
        explanation: '防止體力變成負數，提前結束方法執行。',
      },
      {
        line: 18,
        code: '        self.energy -= 25',
        role: '扣減實例屬性',
        explanation: '玩耍消耗 25 點體力，僅影響呼叫此方法的實例。',
      },
      {
        line: 19,
        code: '        self.mood = "開心"',
        role: '狀態更新',
        explanation: '更新此物件的 mood 屬性為開心。',
      },
      {
        line: 20,
        code: '        return f"{self.name} 玩得很開心！體力剩餘 {self.energy}%"',
        role: '回傳執行訊息',
        explanation: '回傳最新互動結果給呼叫端。',
      },
    ],
    constructorFields: [
      {
        key: 'name',
        label: 'name (寵物名稱)',
        type: 'text',
        defaultValue: '茶茶',
        placeholder: '例如：茶茶、Mochi',
      },
      {
        key: 'energy',
        label: 'energy (初始體力)',
        type: 'number',
        defaultValue: '80',
        placeholder: '0 - 100',
        min: 0,
        max: 100,
      },
    ],
    initialInstances: [
      { varName: 'pet_1', args: { name: '小橘', energy: '80' } },
      { varName: 'pet_2', args: { name: '麻糬', energy: '40' } },
    ],
    methods: [
      {
        name: 'feed',
        label: 'feed(amount)',
        description: '餵食寵物並補充體力',
        highlightLine: 9,
        params: [
          {
            key: 'amount',
            label: 'amount (補充量)',
            type: 'number',
            defaultValue: '20',
            min: 5,
            max: 50,
          },
        ],
        execute: (instanceName, attrs, _classAttr, paramValues) => {
          const amount = Math.max(1, Math.min(100, Number(paramValues.amount) || 20));
          const currentEnergy = Number(attrs.energy) || 0;
          const nextEnergy = Math.min(100, currentEnergy + amount);
          return {
            nextAttrs: {
              ...attrs,
              energy: nextEnergy,
              mood: '滿足',
            },
            callExpression: `${instanceName}.feed(${amount})`,
            consoleOutput: `'${attrs.name} 吃飽了，體力 ${nextEnergy}%'`,
            selfTrace: `Pet.feed(self=${instanceName}, amount=${amount}) → 修改 ${instanceName}.__dict__['energy']`,
            highlightLine: 10,
          };
        },
      },
      {
        name: 'play',
        label: 'play()',
        description: '消耗 25 體力玩耍',
        highlightLine: 14,
        params: [],
        execute: (instanceName, attrs) => {
          const currentEnergy = Number(attrs.energy) || 0;
          if (currentEnergy < 25) {
            return {
              nextAttrs: {
                ...attrs,
                mood: '疲倦',
              },
              callExpression: `${instanceName}.play()`,
              consoleOutput: `'${attrs.name} 太累了，需要先休息或餵食'`,
              selfTrace: `Pet.play(self=${instanceName}) → 檢查 self.energy (${currentEnergy}) < 25`,
              highlightLine: 15,
            };
          }
          const nextEnergy = currentEnergy - 25;
          return {
            nextAttrs: {
              ...attrs,
              energy: nextEnergy,
              mood: '開心',
            },
            callExpression: `${instanceName}.play()`,
            consoleOutput: `'${attrs.name} 玩得很開心！體力剩餘 ${nextEnergy}%'`,
            selfTrace: `Pet.play(self=${instanceName}) → 扣減 ${instanceName}.energy 至 ${nextEnergy}`,
            highlightLine: 18,
          };
        },
      },
    ],
  },
  {
    id: 'bank',
    className: 'BankAccount',
    title: '銀行帳戶 BankAccount',
    analogy: '每個帳戶實例保有獨立的戶名、餘額與鎖定狀態，透過方法規則保護資產不被非法扣除。',
    varPrefix: 'acc',
    classAttrName: 'bank_name',
    classAttrDefault: 'PyBank Taipei',
    classAttrDescription: '類別屬性：所有帳戶都屬於同一家銀行，修改 BankAccount.bank_name 會同步反映在所有實例。',
    meterKey: 'balance',
    meterLabel: '帳戶餘額',
    meterUnit: ' NTD',
    meterMax: 5000,
    codeLines: [
      {
        line: 1,
        code: 'class BankAccount:',
        role: '類別定義',
        explanation: '定義銀行帳戶類別，將「資料（餘額）」與「行為（存提款）」封裝在一起。',
      },
      {
        line: 2,
        code: '    bank_name = "PyBank Taipei"',
        role: '類別屬性',
        explanation: '屬於 BankAccount 類別本身的屬性，所有帳戶共用同一間銀行名稱。',
      },
      {
        line: 3,
        code: '',
        role: '空白分隔行',
        explanation: '維持程式碼視覺結構清晰。',
      },
      {
        line: 4,
        code: '    def __init__(self, owner, balance=1000):',
        role: '建構方法',
        explanation: '開戶時設定戶名 owner 與起始存款 balance（預設 1000）。',
      },
      {
        line: 5,
        code: '        self.owner = owner',
        role: '綁定戶名',
        explanation: '儲存這個帳戶實例的擁有者名稱。',
      },
      {
        line: 6,
        code: '        self.balance = max(0, balance)',
        role: '綁定餘額',
        explanation: '確保開戶餘額不會是負數。',
      },
      {
        line: 7,
        code: '        self.is_locked = False',
        role: '狀態旗標',
        explanation: '布林屬性記錄帳戶是否凍結，預設為 False（正常啟用）。',
      },
      {
        line: 8,
        code: '',
        role: '空白分隔行',
        explanation: '分隔建構方法與操作方法。',
      },
      {
        line: 9,
        code: '    def deposit(self, amount):',
        role: '存款方法',
        explanation: '接收金額參數，驗證後加進 self.balance。',
      },
      {
        line: 10,
        code: '        if self.is_locked or amount <= 0:',
        role: '業務邏輯檢查',
        explanation: '物件方法負責把關商業規則：凍結中或負金額都不允許存入。',
      },
      {
        line: 11,
        code: '            return "存款失敗：帳戶已鎖定或金額無效"',
        role: '拒絕無效操作',
        explanation: '回傳明確的錯誤訊息而不更動餘額。',
      },
      {
        line: 12,
        code: '        self.balance += amount',
        role: '更新餘額',
        explanation: '將存款金額累加至該實例的餘額屬性。',
      },
      {
        line: 13,
        code: '        return f"{self.owner} 存入 {amount}，餘額 {self.balance}"',
        role: '回傳交易明細',
        explanation: '回傳格式化交易結果。',
      },
      {
        line: 14,
        code: '',
        role: '空白分隔行',
        explanation: '分隔不同方法。',
      },
      {
        line: 15,
        code: '    def withdraw(self, amount):',
        role: '提款方法',
        explanation: '提款前檢查是否凍結及餘額是否充足。',
      },
      {
        line: 16,
        code: '        if self.is_locked or amount > self.balance or amount <= 0:',
        role: '安全防護條件',
        explanation: '防止透支領出超過餘額的金錢。',
      },
      {
        line: 17,
        code: '            return "提款失敗：餘額不足或帳戶鎖定"',
        role: '阻擋提款',
        explanation: '狀態不符時維持餘額不變。',
      },
      {
        line: 18,
        code: '        self.balance -= amount',
        role: '扣款更新',
        explanation: '從該實例扣除指定金額。',
      },
      {
        line: 19,
        code: '        return f"{self.owner} 領出 {amount}，餘額 {self.balance}"',
        role: '回傳結果',
        explanation: '回傳最新餘額通知。',
      },
    ],
    constructorFields: [
      {
        key: 'owner',
        label: 'owner (戶名)',
        type: 'text',
        defaultValue: '林小安',
        placeholder: '輸入帳戶持有人',
      },
      {
        key: 'balance',
        label: 'balance (起始餘額)',
        type: 'number',
        defaultValue: '1500',
        placeholder: '0 - 10000',
        min: 0,
        max: 50000,
      },
    ],
    initialInstances: [
      { varName: 'acc_1', args: { owner: '王小明', balance: '2400' } },
      { varName: 'acc_2', args: { owner: '陳佳穎', balance: '900' } },
    ],
    methods: [
      {
        name: 'deposit',
        label: 'deposit(amount)',
        description: '存入指定金額',
        highlightLine: 9,
        params: [
          {
            key: 'amount',
            label: 'amount (金額)',
            type: 'number',
            defaultValue: '500',
            min: 100,
            max: 5000,
          },
        ],
        execute: (instanceName, attrs, _classAttr, paramValues) => {
          const amount = Number(paramValues.amount) || 500;
          if (attrs.is_locked || amount <= 0) {
            return {
              nextAttrs: attrs,
              callExpression: `${instanceName}.deposit(${amount})`,
              consoleOutput: `'存款失敗：帳戶已鎖定或金額無效'`,
              selfTrace: `BankAccount.deposit(self=${instanceName}, amount=${amount}) → 遭到阻擋`,
              highlightLine: 11,
            };
          }
          const nextBalance = Number(attrs.balance) + amount;
          return {
            nextAttrs: { ...attrs, balance: nextBalance },
            callExpression: `${instanceName}.deposit(${amount})`,
            consoleOutput: `'${attrs.owner} 存入 ${amount}，餘額 ${nextBalance}'`,
            selfTrace: `BankAccount.deposit(self=${instanceName}, amount=${amount}) → ${instanceName}.balance = ${nextBalance}`,
            highlightLine: 12,
          };
        },
      },
      {
        name: 'withdraw',
        label: 'withdraw(amount)',
        description: '從帳戶提領金額',
        highlightLine: 15,
        params: [
          {
            key: 'amount',
            label: 'amount (金額)',
            type: 'number',
            defaultValue: '600',
            min: 100,
            max: 5000,
          },
        ],
        execute: (instanceName, attrs, _classAttr, paramValues) => {
          const amount = Number(paramValues.amount) || 600;
          const cur = Number(attrs.balance);
          if (attrs.is_locked || amount > cur || amount <= 0) {
            return {
              nextAttrs: attrs,
              callExpression: `${instanceName}.withdraw(${amount})`,
              consoleOutput: `'提款失敗：餘額不足或帳戶鎖定'`,
              selfTrace: `BankAccount.withdraw(self=${instanceName}, amount=${amount}) → 餘額(${cur})不足或已鎖定`,
              highlightLine: 17,
            };
          }
          const nextBalance = cur - amount;
          return {
            nextAttrs: { ...attrs, balance: nextBalance },
            callExpression: `${instanceName}.withdraw(${amount})`,
            consoleOutput: `'${attrs.owner} 領出 ${amount}，餘額 ${nextBalance}'`,
            selfTrace: `BankAccount.withdraw(self=${instanceName}, amount=${amount}) → ${instanceName}.balance = ${nextBalance}`,
            highlightLine: 18,
          };
        },
      },
      {
        name: 'toggle_lock',
        label: '切換鎖定狀態',
        description: '模擬設定 self.is_locked = not self.is_locked',
        highlightLine: 7,
        params: [],
        execute: (instanceName, attrs) => {
          const nextLocked = !Boolean(attrs.is_locked);
          return {
            nextAttrs: { ...attrs, is_locked: nextLocked },
            callExpression: `${instanceName}.is_locked = ${nextLocked ? 'True' : 'False'}`,
            consoleOutput: `${nextLocked ? 'True (帳戶已安全凍結)' : 'False (帳戶已解除凍結)'}`,
            selfTrace: `直接修改實例屬性：${instanceName}.__dict__['is_locked'] = ${nextLocked ? 'True' : 'False'}`,
            highlightLine: 7,
          };
        },
      },
    ],
  },
  {
    id: 'coffee',
    className: 'CoffeeMachine',
    title: '咖啡機 CoffeeMachine',
    analogy: '每台實體咖啡機內部各自追蹤水量與咖啡豆存量，萃取方法會協同檢查多項內部資源。',
    varPrefix: 'barista',
    classAttrName: 'voltage',
    classAttrDefault: '110V',
    classAttrDescription: '類別屬性：此機型標準電壓規格，所有機器實例預設共用的製造規格。',
    meterKey: 'water_ml',
    meterLabel: '水箱存量',
    meterUnit: ' ml',
    meterMax: 500,
    codeLines: [
      {
        line: 1,
        code: 'class CoffeeMachine:',
        role: '類別定義',
        explanation: '宣告咖啡機設計圖，定義每台機器該具備哪些感測數值與操作功能。',
      },
      {
        line: 2,
        code: '    voltage = "110V"',
        role: '類別屬性',
        explanation: '全系列機型共享的規格常數。',
      },
      {
        line: 3,
        code: '',
        role: '空白分隔行',
        explanation: '結構分隔。',
      },
      {
        line: 4,
        code: '    def __init__(self, location, water_ml=300):',
        role: '建構方法',
        explanation: '每台咖啡機擺放在不同門市，有各自的擺放位置與起始水量。',
      },
      {
        line: 5,
        code: '        self.location = location',
        role: '實例屬性',
        explanation: '記錄這台機器的位置（如「吧台區」）。',
      },
      {
        line: 6,
        code: '        self.water_ml = water_ml',
        role: '水量狀態',
        explanation: '記錄當前水箱毫升數。',
      },
      {
        line: 7,
        code: '        self.cups_made = 0',
        role: '計數器屬性',
        explanation: '每台機器獨立累積製作杯數，出廠預設為 0。',
      },
      {
        line: 8,
        code: '',
        role: '空白分隔行',
        explanation: '分隔方法。',
      },
      {
        line: 9,
        code: '    def brew_espresso(self):',
        role: '萃取方法',
        explanation: '製作一杯濃縮咖啡需要消耗 60 ml 熱水。',
      },
      {
        line: 10,
        code: '        if self.water_ml < 60:',
        role: '耗材檢查',
        explanation: '水量低於 60 ml 時拒絕萃取，避免機器空燒。',
      },
      {
        line: 11,
        code: '            return "水量不足，請先執行 refill()"',
        role: '警示回傳',
        explanation: '提示呼叫者補水。',
      },
      {
        line: 12,
        code: '        self.water_ml -= 60',
        role: '消耗水箱水量',
        explanation: '扣除該台實例的水量屬性。',
      },
      {
        line: 13,
        code: '        self.cups_made += 1',
        role: '遞增杯數統計',
        explanation: '該機器的 cups_made 加 1。',
      },
      {
        line: 14,
        code: '        return f"[{self.location}] 第 {self.cups_made} 杯完成！"',
        role: '回傳製作訊息',
        explanation: '結合實例位置與杯數輸出。',
      },
      {
        line: 15,
        code: '',
        role: '空白分隔行',
        explanation: '分隔方法。',
      },
      {
        line: 16,
        code: '    def refill(self, ml=200):',
        role: '補水方法',
        explanation: '為當前機器水箱加滿水（上限 500 ml）。',
      },
      {
        line: 17,
        code: '        self.water_ml = min(500, self.water_ml + ml)',
        role: '上限保護賦值',
        explanation: '避免水箱溢出，限制最大容量 500 ml。',
      },
      {
        line: 18,
        code: '        return f"[{self.location}] 已補水至 {self.water_ml} ml"',
        role: '回傳結果',
        explanation: '回傳目前最新水位。',
      },
    ],
    constructorFields: [
      {
        key: 'location',
        label: 'location (擺放位置)',
        type: 'text',
        defaultValue: '會議室',
        placeholder: '例如：大廳吧台、茶水間',
      },
      {
        key: 'water_ml',
        label: 'water_ml (起始水量)',
        type: 'number',
        defaultValue: '240',
        placeholder: '0 - 500',
        min: 0,
        max: 500,
      },
    ],
    initialInstances: [
      { varName: 'barista_1', args: { location: '一樓吧台', water_ml: '300' } },
      { varName: 'barista_2', args: { location: '二樓休息區', water_ml: '90' } },
    ],
    methods: [
      {
        name: 'brew_espresso',
        label: 'brew_espresso()',
        description: '消耗 60ml 水製作濃縮咖啡',
        highlightLine: 9,
        params: [],
        execute: (instanceName, attrs) => {
          const water = Number(attrs.water_ml) || 0;
          if (water < 60) {
            return {
              nextAttrs: attrs,
              callExpression: `${instanceName}.brew_espresso()`,
              consoleOutput: `'水量不足，請先執行 refill()'`,
              selfTrace: `CoffeeMachine.brew_espresso(self=${instanceName}) → water_ml (${water}) < 60`,
              highlightLine: 11,
            };
          }
          const nextWater = water - 60;
          const nextCups = (Number(attrs.cups_made) || 0) + 1;
          return {
            nextAttrs: {
              ...attrs,
              water_ml: nextWater,
              cups_made: nextCups,
            },
            callExpression: `${instanceName}.brew_espresso()`,
            consoleOutput: `'[${attrs.location}] 第 ${nextCups} 杯完成！'`,
            selfTrace: `CoffeeMachine.brew_espresso(self=${instanceName}) → water_ml=${nextWater}, cups_made=${nextCups}`,
            highlightLine: 12,
          };
        },
      },
      {
        name: 'refill',
        label: 'refill(ml)',
        description: '補充水箱水量（上限 500 ml）',
        highlightLine: 16,
        params: [
          {
            key: 'ml',
            label: 'ml (補水量)',
            type: 'number',
            defaultValue: '200',
            min: 50,
            max: 500,
          },
        ],
        execute: (instanceName, attrs, _classAttr, paramValues) => {
          const ml = Math.max(10, Number(paramValues.ml) || 200);
          const nextWater = Math.min(500, (Number(attrs.water_ml) || 0) + ml);
          return {
            nextAttrs: {
              ...attrs,
              water_ml: nextWater,
            },
            callExpression: `${instanceName}.refill(${ml})`,
            consoleOutput: `'[${attrs.location}] 已補水至 ${nextWater} ml'`,
            selfTrace: `CoffeeMachine.refill(self=${instanceName}, ml=${ml}) → water_ml=${nextWater}`,
            highlightLine: 17,
          };
        },
      },
    ],
  },
];

export interface LifecycleStep {
  step: number;
  title: string;
  activeLine: number;
  summary: string;
  detail: string;
  stackVars: Array<{ name: string; targetAddr: string | null; note: string }>;
  heapObjects: Array<{
    addr: string;
    typeName: string;
    dict: Array<{ key: string; value: string }>;
    highlightKey?: string;
  }>;
  selfPointsTo: string | null;
}

export const LIFECYCLE_CODE = [
  'class Dog:',
  '    def __init__(self, name, age):',
  '        self.name = name',
  '        self.age = age',
  '',
  '    def bark(self):',
  '        return f"{self.name}：汪！"',
  '',
  'dog = Dog("阿柴", 3)',
  'msg = dog.bark()',
];

export const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    step: 1,
    title: '定義類別藍圖',
    activeLine: 1,
    summary: 'Python 載入 class Dog 區塊，在記憶體建立「類別物件」，此時尚未有任何狗狗實例。',
    detail: '執行 class Dog: 只是先把建構子 __init__ 與方法 bark 存進 Dog 藍圖裡，還沒有配置任何個別物件的資料空間。',
    stackVars: [{ name: 'Dog', targetAddr: '0x00C0 (Class)', note: '藍圖本體' }],
    heapObjects: [],
    selfPointsTo: null,
  },
  {
    step: 2,
    title: '配置新物件記憶體空間',
    activeLine: 9,
    summary: '呼叫 Dog("阿柴", 3) 時，Python 先在 Heap 記憶體配置一塊全新的空白 Dog 實例 (0x104A)。',
    detail: '在 __init__ 執行前，Python 底層 __new__ 已經生出一個空物件，並把它的型別標記為 Dog。',
    stackVars: [{ name: 'Dog', targetAddr: '0x00C0 (Class)', note: '藍圖本體' }],
    heapObjects: [
      {
        addr: '0x104A',
        typeName: 'Dog 實例',
        dict: [],
      },
    ],
    selfPointsTo: null,
  },
  {
    step: 3,
    title: '自動將新物件綁定為 self',
    activeLine: 2,
    summary: 'Python 自動把剛剛建好的 0x104A 當作第一個參數 self 傳入 __init__(self, "阿柴", 3)。',
    detail: '你不需要手動傳入 self！Python 引擎會幫你把新生成的記憶體位址填進 self 這個參數裡。',
    stackVars: [
      { name: 'Dog', targetAddr: '0x00C0 (Class)', note: '藍圖本體' },
      { name: 'self (區域參數)', targetAddr: '0x104A', note: '自動指向新物件' },
    ],
    heapObjects: [
      {
        addr: '0x104A',
        typeName: 'Dog 實例',
        dict: [],
      },
    ],
    selfPointsTo: '0x104A',
  },
  {
    step: 4,
    title: '透過 self 寫入實例屬性',
    activeLine: 4,
    summary: '執行 self.name = "阿柴" 與 self.age = 3，把資料寫入 0x104A 的專屬空間 (__dict__)。',
    detail: '完成初始化後，變數 dog 正式接收 0x104A 的位址參考，__init__ 結束後區域變數 self 即釋放。',
    stackVars: [
      { name: 'Dog', targetAddr: '0x00C0 (Class)', note: '藍圖本體' },
      { name: 'dog', targetAddr: '0x104A', note: '指向已初始化物件' },
    ],
    heapObjects: [
      {
        addr: '0x104A',
        typeName: 'Dog 實例',
        dict: [
          { key: 'name', value: '"阿柴"' },
          { key: 'age', value: '3' },
        ],
        highlightKey: 'age',
      },
    ],
    selfPointsTo: null,
  },
  {
    step: 5,
    title: '呼叫方法時再次綁定 self',
    activeLine: 6,
    summary: '執行 dog.bark() 等同於 Dog.bark(dog)！Python 再度把 dog (0x104A) 傳入成為 self。',
    detail: '因此 bark() 內部讀取 self.name 時，能精準從 0x104A 取出 "阿柴"，回傳 "阿柴：汪！"。',
    stackVars: [
      { name: 'dog', targetAddr: '0x104A', note: '呼叫者物件' },
      { name: 'self (bark參數)', targetAddr: '0x104A', note: '語法糖自動綁定' },
    ],
    heapObjects: [
      {
        addr: '0x104A',
        typeName: 'Dog 實例',
        dict: [
          { key: 'name', value: '"阿柴"' },
          { key: 'age', value: '3' },
        ],
        highlightKey: 'name',
      },
    ],
    selfPointsTo: '0x104A',
  },
];

export interface InheritanceNode {
  id: 'Animal' | 'Dog' | 'Cat' | 'GuideDog';
  name: string;
  parent: string | null;
  roleLabel: string;
  mro: string[];
  code: string;
  ownMethods: string[];
  inheritedMethods: string[];
  overriddenMethods: string[];
  demoInstance: string;
  demoSpeakOutput: string;
}

export const INHERITANCE_NODES: InheritanceNode[] = [
  {
    id: 'Animal',
    name: 'Animal (父類別 / Base)',
    parent: null,
    roleLabel: '基底類別',
    mro: ['Animal', 'object'],
    ownMethods: ['__init__(self, name)', 'breathe(self)', 'speak(self)'],
    inheritedMethods: [],
    overriddenMethods: [],
    demoInstance: 'Animal("生物")',
    demoSpeakOutput: '「...（安靜呼吸）」',
    code: `class Animal:
    def __init__(self, name):
        self.name = name

    def breathe(self):
        return f"{self.name} 正在呼吸"

    def speak(self):
        return "..."`,
  },
  {
    id: 'Dog',
    name: 'Dog(Animal)',
    parent: 'Animal',
    roleLabel: '子類別 · 覆寫 speak',
    mro: ['Dog', 'Animal', 'object'],
    ownMethods: ['fetch(self)'],
    inheritedMethods: ['__init__(self, name)', 'breathe(self)'],
    overriddenMethods: ['speak(self)'],
    demoInstance: 'Dog("小黑")',
    demoSpeakOutput: '「小黑：汪汪！」',
    code: `class Dog(Animal):
    def speak(self):
        return f"{self.name}：汪汪！"

    def fetch(self):
        return f"{self.name} 接住了飛盤"`,
  },
  {
    id: 'Cat',
    name: 'Cat(Animal)',
    parent: 'Animal',
    roleLabel: '子類別 · 覆寫 speak',
    mro: ['Cat', 'Animal', 'object'],
    ownMethods: ['purr(self)'],
    inheritedMethods: ['__init__(self, name)', 'breathe(self)'],
    overriddenMethods: ['speak(self)'],
    demoInstance: 'Cat("橘子")',
    demoSpeakOutput: '「橘子：喵～」',
    code: `class Cat(Animal):
    def speak(self):
        return f"{self.name}：喵～"

    def purr(self):
        return f"{self.name} 發出呼嚕聲"`,
  },
  {
    id: 'GuideDog',
    name: 'GuideDog(Dog)',
    parent: 'Dog',
    roleLabel: '孫類別 · super() 擴充',
    mro: ['GuideDog', 'Dog', 'Animal', 'object'],
    ownMethods: ['guide(self)'],
    inheritedMethods: ['breathe(self)', 'fetch(self)'],
    overriddenMethods: ['__init__(self, name, cert_id)', 'speak(self)'],
    demoInstance: 'GuideDog("阿福", "TW-09")',
    demoSpeakOutput: '「阿福（執照 TW-09）：低聲提醒！」',
    code: `class GuideDog(Dog):
    def __init__(self, name, cert_id):
        super().__init__(name)  # 呼叫父類別建構子
        self.cert_id = cert_id

    def speak(self):
        return f"{self.name}（執照 {self.cert_id}）：低聲提醒！"`,
  },
];

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  fixedCode?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'self 參數遺漏錯誤',
    question: '執行下方程式碼時會發生什麼結果？',
    code: `class Robot:
    def greet():
        return "Hello!"

bot = Robot()
print(bot.greet())`,
    options: [
      '印出 "Hello!"',
      '發生 TypeError：greet() takes 0 positional arguments but 1 was given',
      '印出 None',
      '發生 SyntaxError 語法錯誤',
    ],
    correctIndex: 1,
    explanation:
      '呼叫 bot.greet() 時，Python 會自動把實例 bot 當作第一個位置參數傳入方法，但定義 greet() 時沒有寫 self 參數來接收，因此拋出 TypeError。',
    fixedCode: `class Robot:
    def greet(self):  # 加上 self 接收呼叫實例
        return "Hello!"`,
  },
  {
    id: 2,
    topic: '類別屬性與可變物件陷阱',
    question: '以下程式碼執行後，a.items 的內容為何？',
    code: `class Bag:
    items = []  # 注意：定義在類別層級

a = Bag()
b = Bag()
a.items.append("水壺")
b.items.append("鑰匙")
print(a.items)`,
    options: [
      '["水壺"]',
      '["鑰匙"]',
      '["水壺", "鑰匙"]',
      '[]',
    ],
    correctIndex: 2,
    explanation:
      'items = [] 是「類別屬性」，被 a 與 b 兩個實例共同參照同一個 list！要讓每個實例各自擁有獨立清單，必須寫在 __init__ 裡的 self.items = []。',
    fixedCode: `class Bag:
    def __init__(self):
        self.items = []  # 每個實例各自獨立的串列`,
  },
  {
    id: 3,
    topic: '類別屬性遮蔽 (Shadowing)',
    question: '這段程式碼最後兩行分別會印出什麼？',
    code: `class Car:
    wheels = 4

c1 = Car()
c2 = Car()
c1.wheels = 6
print(c1.wheels, c2.wheels)`,
    options: [
      '6 6',
      '6 4',
      '4 4',
      '發生 AttributeError',
    ],
    correctIndex: 1,
    explanation:
      '執行 c1.wheels = 6 時，會在 c1 的實例字典 (__dict__) 新增一個實例屬性 wheels，遮蔽了類別屬性；而 c2 本身沒有 wheels 實例屬性，因此仍向上讀取 Car.wheels 的 4。',
  },
  {
    id: 4,
    topic: '繼承與 super()',
    question: '建立 Student 實例時，為什麼建議在 __init__ 中呼叫 super().__init__(name)？',
    code: `class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade`,
    options: [
      '因為子類別無法存取任何父類別的方法',
      '為了重複利用父類別的初始化邏輯，避免 self.name 遺失',
      '為了讓 Student 的執行速度變快兩倍',
      'Python 規定所有方法內都必須寫 super()',
    ],
    correctIndex: 1,
    explanation:
      '當子類別 Student 自行定義了 __init__ 時，就會覆寫掉父類別 Person 的 __init__。透過 super().__init__(name) 可以委派父類別完成共用屬性的初始化，避免重複撰寫程式碼。',
  },
  {
    id: 5,
    topic: '封裝與魔術方法',
    question: '想讓 print(book) 印出「《Python 實戰》」，而不是 <Book object at 0x...>，應該實作哪個方法？',
    code: `class Book:
    def __init__(self, title):
        self.title = title

    # 應實作哪個魔術方法？`,
    options: [
      '__init__',
      '__str__',
      '__len__',
      '__call__',
    ],
    correctIndex: 1,
    explanation:
      '__str__(self) 負責定義物件被 str() 或 print() 轉換成人類可讀字串時的輸出格式；__repr__ 則偏向開發者除錯用的精確表示法。',
    fixedCode: `class Book:
    def __init__(self, title):
        self.title = title

    def __str__(self):
        return f"《{self.title}》"`,
  },
];
