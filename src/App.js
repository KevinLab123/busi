import logo from './logo.svg';
import './App.css';
import Product from './components/Product';
import ProductsTable from './components/ProductsTable';
import EditProduct from './components/EditProduct';
import InvMovements from './components/InvMovements';

function App() {
  return (
    <div className="App">
      <ProductsTable/>
    </div>
  );
}

export default App;

