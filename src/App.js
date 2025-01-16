import logo from './logo.svg';
import './App.css';
import Product from './components/Product';
import ProductsTable from './components/ProductsTable';
import EditProduct from './components/EditProduct';
import InvMovements from './components/InvMovements';
import OrderManage from './components/OrderManage';
import MovViewer from './components/MovViewer';

function App() {
  return (
    <div className="App">
      <OrderManage/>
    </div>
  );
}

export default App;

