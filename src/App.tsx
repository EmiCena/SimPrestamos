import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, DollarSign, Calendar, Percent, ArrowRight, TrendingUp, Info, X, Download } from 'lucide-react';

export default function App() {
  const [amount, setAmount] = useState<number | ''>(10000);
  const [rate, setRate] = useState<number | ''>(50);
  const [rateType, setRateType] = useState<'annual' | 'monthly' | 'daily'>('annual');
  const [days, setDays] = useState<number | ''>(30);
  const [showHelp, setShowHelp] = useState(false);

  const results = useMemo(() => {
    const principal = Number(amount) || 0;
    const interestRate = Number(rate) || 0;
    const periodDays = Number(days) || 0;

    let dailyRate = 0;
    if (rateType === 'annual') {
      dailyRate = interestRate / 365 / 100;
    } else if (rateType === 'monthly') {
      dailyRate = interestRate / 30 / 100;
    } else if (rateType === 'daily') {
      dailyRate = interestRate / 100;
    }

    const profit = principal * dailyRate * periodDays;
    const total = principal + profit;
    const dailyInstallment = periodDays > 0 ? total / periodDays : 0;

    return {
      profit,
      total,
      principal,
      dailyInstallment
    };
  }, [amount, rate, rateType, days]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const exportToCSV = () => {
    const headers = ['Monto Inicial', 'Tasa de Interes (%)', 'Tipo de Tasa', 'Plazo (Dias)', 'Ganancia Neta', 'Monto Total', 'Cuota Diaria'];
    const rateTypeLabel = rateType === 'annual' ? 'Anual' : rateType === 'monthly' ? 'Mensual' : 'Diaria';
    
    const row = [
      results.principal,
      Number(rate) || 0,
      rateTypeLabel,
      Number(days) || 0,
      results.profit.toFixed(2),
      results.total.toFixed(2),
      results.dailyInstallment.toFixed(2)
    ];

    const csvContent = [
      headers.join(','),
      row.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `simulacion_prestamo_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-4 md:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
      >
        {/* Left Column: Inputs */}
        <div className="p-8 lg:p-10 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Simulador</h1>
                <p className="text-sm text-neutral-500">Calcula tus ganancias fácilmente</p>
              </div>
            </div>
            <button 
              onClick={() => setShowHelp(true)}
              className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Ayuda y Tutorial"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 block">Monto Inicial</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') setAmount('');
                    else if (Number(val) >= 0) setAmount(Number(val));
                  }}
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
                  placeholder="10000"
                />
              </div>
            </div>

            {/* Rate Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 block">Tasa de Interés</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Percent className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={rate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') setRate('');
                      else if (Number(val) >= 0) setRate(Number(val));
                    }}
                    className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
                    placeholder="50"
                  />
                </div>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value as any)}
                  className="w-1/3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none font-medium"
                >
                  <option value="annual">Anual</option>
                  <option value="monthly">Mensual</option>
                  <option value="daily">Diaria</option>
                </select>
              </div>
            </div>

            {/* Days Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 block">Plazo (Días)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') setDays('');
                    else if (Number(val) >= 0) setDays(Number(val));
                  }}
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="bg-neutral-900 text-white p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-xl font-medium text-neutral-400">Resumen de la Operación</h2>
            
            <div className="space-y-6">
              <motion.div 
                key={results.profit}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-2 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Ganancia Neta</span>
                </div>
                <div className="text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                  {formatCurrency(results.profit)}
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                  <div className="text-sm text-neutral-400 mb-1">Capital Inicial</div>
                  <div className="text-xl font-medium text-white">
                    {formatCurrency(results.principal)}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                  <div className="text-sm text-neutral-400 mb-1">Monto Total</div>
                  <div className="text-xl font-medium text-white">
                    {formatCurrency(results.total)}
                  </div>
                </div>
                <div className="bg-indigo-500/20 rounded-2xl p-5 border border-indigo-500/30 col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-indigo-200 mb-1">Cuota Diaria</div>
                    <div className="text-2xl font-medium text-white">
                      {formatCurrency(results.dailyInstallment)}
                    </div>
                  </div>
                  <div className="text-right text-indigo-200/60 text-sm">
                    x {Number(days) || 0} días
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-sm text-neutral-400">
              <span>Tasa {rateType === 'annual' ? 'Anual' : rateType === 'monthly' ? 'Mensual' : 'Diaria'}: {Number(rate) || 0}%</span>
              <div className="flex items-center gap-1">
                <span>{Number(days) || 0} días</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <button 
              onClick={exportToCSV}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-white/10"
            >
              <Download className="w-5 h-5" />
              Exportar a CSV
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-neutral-900">¿Cómo usar el simulador?</h3>
                <button onClick={() => setShowHelp(false)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-neutral-600 text-sm">
                <p>Este simulador te permite calcular rápidamente los rendimientos de un préstamo o inversión.</p>
                
                <h4 className="font-semibold text-neutral-900 mt-4">Campos de Entrada</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong className="text-neutral-900">Monto Inicial:</strong> El capital base que vas a prestar o invertir.</li>
                  <li><strong className="text-neutral-900">Tasa de Interés:</strong> El porcentaje de ganancia. Puedes elegir si esta tasa se aplica de forma anual, mensual o diaria.</li>
                  <li><strong className="text-neutral-900">Plazo (Días):</strong> La cantidad total de días que durará la operación.</li>
                </ul>

                <h4 className="font-semibold text-neutral-900 mt-4">Resultados</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong className="text-neutral-900">Ganancia Neta:</strong> El dinero extra generado únicamente por los intereses.</li>
                  <li><strong className="text-neutral-900">Monto Total:</strong> La suma de tu capital inicial más la ganancia neta. Es lo que recibirás al final.</li>
                  <li><strong className="text-neutral-900">Cuota Diaria:</strong> Si el deudor te pagara todos los días, este es el monto exacto que debería entregarte para saldar el Monto Total al finalizar el plazo.</li>
                </ul>
              </div>
              <div className="p-6 border-t border-neutral-100 bg-neutral-50">
                <button onClick={() => setShowHelp(false)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                  ¡Entendido!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
