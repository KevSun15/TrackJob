import { Grid,Box, Container, Section} from "@radix-ui/themes"

export default function Info(){
  return(
    <>
    <div className="py-20"></div>
    <Section size="4" className="bg-slate-200">
    <Container size="4" className="pt-8">
      <Grid columns="3" gap="9" rows="repeat(1, 372px)" width="auto">
        <Box className="bg-white rounded-xl">

        </Box>
        <Box className="bg-white rounded-xl">
          
        </Box>
        <Box className="bg-white rounded-xl">
          
        </Box>
      </Grid>
    </Container>
    </Section>
    </>
  )
}