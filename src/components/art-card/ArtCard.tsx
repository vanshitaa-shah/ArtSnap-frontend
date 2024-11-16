import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Art } from '@/types'

const ArtCard = ({ art }: { art: Art }) => {
  
  return (
    <Card className="overflow-hidden w-[240px]">
      <CardContent className="p-0">
        <div className="rounded-t h-[240px] w-full bg-slate-100">
          <img
            src={art.imageUrl}
            className="rounded-t-md object-contain w-full h-full"
          />
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-xl">{art.artName[0]}</CardTitle>
        <CardDescription className="text-sm font-medium">
          by {art.artistName[0]}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link to={`/arts/${art.id}`}>
          <Button variant="outline">View More</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ArtCard

