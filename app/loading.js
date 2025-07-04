import Loading from '@/components/Loading';

const Loadingcomponent = () => {
  return (
    <main
      role="status"
      aria-live="polite"
    >
      <Loading />
    </main>
  );
};

export default Loadingcomponent;
