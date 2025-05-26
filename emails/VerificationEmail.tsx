import {Button,
  Html,Head,
  Preview,
  Heading,
  Row,Section,Text,Font
} from "@react-email/components"


interface VerificationEmailProops{
  username :string;
  otp:string;
}

export default function VerificationEmail({username,otp}:VerificationEmailProops){

  return(
    <Html lang="en" dir="ltr"> 
  <Head>
    <title>Verification Code</title>
    <Font fontFamily="Roboto" 
    fallbackFontFamily={"Verdana"}
    fontStyle="normal"
    fontWeight={400} />
  </Head>

  <Preview> Here&apos;s your Verification code:{otp}</Preview>
  <Section>
    <Row>
      <Heading as="h2">hello{username},</Heading>
    </Row>
    <Row>
      <Text>
        Thank you for refistering. please use the following Verification code to complete your registration:
      </Text>
    </Row>

    <Row>
      <Text>{otp}</Text>
    </Row>

    <Row>
      <Text>
        If you did not request this cod, please ignore this email.
      </Text>
    </Row>

    <Row>
      <Button href={`http://localhost:3000/verify/${username}`}>
        Verify here
      </Button>
    </Row>
  </Section>
    </Html>
  )
}