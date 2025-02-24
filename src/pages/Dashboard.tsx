import Button from "../Components/Button"

type Props = {}

function Dashboard({ }: Props) {
  return (
    <div className="mx-6 my-4 h-[100vh]">
      <div className="relative rounded-lg p-9 bg-[#F7E7CE] flex justify-between items-center">
        <div className="absolute top-2 right-5 text-3xl font-light">
        &times;
        </div>
        <div>
          <p className="text-[#263238] font-bold text-xl">Get Ready to Unlock Predictive Maintenance Insights!</p>
          <p className="mt-1 text-[#272727] w-[70%] text-base">Anticipate maintenance needs before issues arise,
            optimizing uptime and reducing unexpected costs</p>
        </div>
        <Button className="h-9 pl-4 pr-4">
          Explore Now
        </Button>
      </div>
      {/* <p className="mt-6 text-[#454545] font-semibold">Overview</p> */}
    </div>
  )
}

export default Dashboard