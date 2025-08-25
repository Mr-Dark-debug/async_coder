export const Component = () => {
  return (
    <div className="relative w-[20px] aspect-square">
      <span className="absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_2px] shadow-current" />
      <span className="absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_2px] shadow-current" />
      <style jsx>{`
        @keyframes loaderAnim {
          0% {
            inset: 0 10px 10px 0;
          }
          12.5% {
            inset: 0 10px 0 0;
          }
          25% {
            inset: 10px 10px 0 0;
          }
          37.5% {
            inset: 10px 0 0 0;
          }
          50% {
            inset: 10px 0 0 10px;
          }
          62.5% {
            inset: 0 0 0 10px;
          }
          75% {
            inset: 0 0 10px 10px;
          }
          87.5% {
            inset: 0 0 10px 0;
          }
          100% {
            inset: 0 10px 10px 0;
          }
        }
        .animate-loaderAnim {
          animation: loaderAnim 2.5s infinite;
        }
        .animation-delay {
          animation-delay: -1.25s;
        }
      `}</style>
    </div>
  );
};