import exploreTextLight from "../../assets/AppsIcons/app-title.png";
import exploreTextDark from "../../assets/AppsIcons/app-title-lite.png";

type Props = {
    setMode?: React.Dispatch<React.SetStateAction<boolean>>;
    mode?: boolean;
};  

const ViewApps = ({ mode }: Props) => {
  return (
    <>
    <div className="flex items-center justify-center mt-16">
      <img 
        src={mode ? exploreTextDark : exploreTextLight} 
        className="w-[45%]" 
        alt="App Title" 
      />
    </div>
    <div className="mt-5 ">

    </div>
    </>
  );
};

export default ViewApps;
