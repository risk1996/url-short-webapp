import React, { useRef, useState } from 'react'
import { Button, Card, Container, Form, Grid, Header, Icon, Input, Label, List, Message } from 'semantic-ui-react'

import DownloadableQRCode from '../../components/DownloadableQRCode'
import Navigation from '../../components/Navigation'
import { validateIdCharacters } from '../../helpers/id'
import { API_BASE_URL, checkStatistics, FailResponseBody, isAxiosError, SuccessGetUrlStatisticsResponseBody } from '../../services/api'

const StatisticsPage: React.VFC = () => {
  const [stats, setStats] = useState<SuccessGetUrlStatisticsResponseBody>()
  const [fieldError, setFieldError] = useState<Error>()
  const [apiError, setApiError] = useState<Error>()
  const shortUrl = useRef('')

  const handleCheckStatistics = async () => {
    if (shortUrl.current.length === 0) {
      setFieldError(new Error('Path is required'))
      return
    } else if (shortUrl.current.length < 5) {
      setFieldError(new Error('Path too short'))
      return
    } else if (shortUrl.current.length > 128) {
      setFieldError(new Error('Path too long'))
      return
    } else if (!validateIdCharacters(shortUrl.current)) {
      setFieldError(new Error('Path must be alphanumeric'))
      return
    }

    setFieldError(undefined)

    try {
      const response = await checkStatistics(shortUrl.current)
      setStats(response.data)
      setApiError(undefined)
    } catch (e) {
      setStats(undefined)

      if (isAxiosError<FailResponseBody>(e)) {
        if (e.response?.data.error.message === 'not-found') {
          setApiError(
            new Error(`Short URL with path ${shortUrl.current} not found`)
          )
          return
        }
      }

      setApiError(new Error('Unhandled exception, please try again later'))
    }
  }

  return (
    <>
      <Navigation activeItem="stats" />

      <Container className="content">
        <Form>
          <Card fluid>
            <Card.Content>
              <Card.Header content="See your short link statistics here" />
            </Card.Content>

            <Card.Content>
              <Form.Field
                error={fieldError?.message}
                fluid
              >
                <Input
                  action={{
                    color: 'blue',
                    content: 'Check',
                    icon: 'search',
                    onClick: handleCheckStatistics,
                    type: 'submit',
                  }}
                  fluid
                  label={`${API_BASE_URL}/`}
                  onChange={(e) => shortUrl.current = e.target.value}
                  placeholder="short-url"
                />

                {fieldError instanceof Error && (
                  <Label pointing prompt>
                    {fieldError.message}
                  </Label>
                )}
              </Form.Field>
            </Card.Content>
          </Card>
        </Form>

        {apiError instanceof Error && (
          <Message
            content={apiError.message}
            error
            header='An error occurred'
          />
        )}

        {stats !== undefined && (
          <Card fluid>
            <Card.Content>
              <Card.Header textAlign="center">
                Statistics of &nbsp;
                <Header as="h3" color="blue" style={{ display: 'inline' }}>
                  {`${API_BASE_URL}/${shortUrl.current}`}
                </Header>
              </Card.Header>
            </Card.Content>

            <Card.Content>
              <Grid columns={16} divided stretched>
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="calendar alternate" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Created At</List.Header>
                          <List.Description as="a">
                            {stats?.data.createdAt}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="edit" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Custom Link?</List.Header>
                          <List.Description as="a">
                            {stats.data.isCustom ? "Yes" : "No"}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="linkify" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            icon
                            color="blue"
                            labelPosition="right"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                stats.data.originalUrl
                              )
                            }
                          >
                            Copy
                            <Icon name="copy" />
                          </Button>
                        </List.Content>
                        <List.Content>
                          <List.Header as="a">Original Url</List.Header>

                          <List.Description
                            as="a"
                            style={{ overflowWrap: "anywhere" }}
                            href={`${stats.data.originalUrl}`}
                            target="_blank"
                          >
                            {stats?.data.originalUrl}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="linkify" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            icon
                            color="blue"
                            labelPosition="right"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                stats.data.originalUrl
                              )
                            }
                          >
                            Copy
                            <Icon name="copy" />
                          </Button>
                        </List.Content>
                        <List.Content>
                          <List.Header as="a">Short Url</List.Header>

                          <List.Description
                            as="a"
                            style={{ overflowWrap: "anywhere" }}
                            href={`${stats.data.shortenedUrl}`}
                            target="_blank"
                          >
                            {stats.data.shortenedUrl}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="eye" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Visit Count</List.Header>
                          <List.Description as="a">
                            {stats.data.visitCount}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>

            <Card.Content textAlign="center">
              <DownloadableQRCode value={stats.data.shortenedUrl} />
            </Card.Content>
          </Card>
        )}
      </Container>
    </>
  )
}

export default StatisticsPage
