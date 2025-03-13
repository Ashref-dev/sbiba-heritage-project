import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

interface SiteProps {
    title: string
    description: string
    imageUrl: string
    href: string
}
export function Site({ title, description, imageUrl, href }: SiteProps) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="space-y-4">
            <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-lg">
              <Image src={imageUrl || "/placeholder.svg"} alt="Project preview" layout="fill" objectFit="cover" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-4">
          {/* <Link href={href} passHref> */}
            <Button className="w-full">Visit</Button>
          {/* </Link> */}
        </CardFooter>
      </Card>
    )
}
  