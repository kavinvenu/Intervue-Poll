import Badge from "./Badge";

const KickedOutScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <Badge />
      
      <h1 className="text-3xl font-bold text-foreground mt-6 mb-4">
        You've been Kicked out !
      </h1>
      
      <p className="text-muted-foreground text-center max-w-md">
        Looks like the teacher had removed you from the poll system .Please Try again sometime.
      </p>
    </div>
  );
};

export default KickedOutScreen;
