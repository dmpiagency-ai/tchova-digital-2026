import React from 'react';

const DashboardGrid: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-500">Data insights</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuários</h3>
            <p className="text-sm text-gray-500">Gestão de perfis</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">💼</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projetos</h3>
            <p className="text-sm text-gray-500">Trabalhos em andamento</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financeiro</h3>
            <p className="text-sm text-gray-500">Transações</p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile</h3>
            <p className="text-sm text-gray-500">Aplicativos</p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">🌐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Web</h3>
            <p className="text-sm text-gray-500">Sites e portais</p>
          </div>

          {/* Card 7 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Design</h3>
            <p className="text-sm text-gray-500">Criação visual</p>
          </div>

          {/* Card 8 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-[#22C55E] font-bold text-xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing</h3>
            <p className="text-sm text-gray-500">Campanhas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
