import Navbar from './components/Navbar';
import ImportForm from './components/ImportForm';
import StatsBar from './components/StatsBar';
import CategoryFilter from './components/CategoryFilter';
import AnalysisResult from './components/AnalysisResult';
import ContentList from './components/ContentList';
import Toast from './components/Toast';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <ImportForm />
        <StatsBar />
        <CategoryFilter />
        <AnalysisResult />
        <ContentList />
      </main>
      <Toast />
    </>
  );
}
