import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader as DialogH, DialogTitle as DialogT, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';

const CourseBuilderPage = () => {
  const { id: courseId } = useParams();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addOrder, setAddOrder] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addLessonOpen, setAddLessonOpen] = useState<string | null>(null); // sectionId or null
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [lessonsBySection, setLessonsBySection] = useState({}); // { [sectionId]: Lesson[] }
  const [deleteLessonInfo, setDeleteLessonInfo] = useState<{sectionId: string, lessonId: string} | null>(null);
  const [deleteLessonLoading, setDeleteLessonLoading] = useState(false);
  const [deleteLessonError, setDeleteLessonError] = useState<string | null>(null);
  const [editLessonInfo, setEditLessonInfo] = useState<{sectionId: string, lesson: any} | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('');
  const [editLessonDescription, setEditLessonDescription] = useState('');
  const [editLessonDuration, setEditLessonDuration] = useState('');
  const [editLessonIsPreview, setEditLessonIsPreview] = useState(false);
  const [editLessonLoading, setEditLessonLoading] = useState(false);
  const [editLessonError, setEditLessonError] = useState<string | null>(null);
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState(false);
  const [deleteSectionError, setDeleteSectionError] = useState<string | null>(null);
  const [editSectionInfo, setEditSectionInfo] = useState<any | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionOrder, setEditSectionOrder] = useState('');
  const [editSectionLoading, setEditSectionLoading] = useState(false);
  const [editSectionError, setEditSectionError] = useState<string | null>(null);
  
  // Resource management state
  const [resourcesByLesson, setResourcesByLesson] = useState({}); // { [lessonId]: Resource[] }
  const [addResourceOpen, setAddResourceOpen] = useState<string | null>(null); // lessonId or null
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('pdf');
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [deleteResourceInfo, setDeleteResourceInfo] = useState<{lessonId: string, resourceId: string} | null>(null);
  const [deleteResourceLoading, setDeleteResourceLoading] = useState(false);
  const [deleteResourceError, setDeleteResourceError] = useState<string | null>(null);
  const [editResourceInfo, setEditResourceInfo] = useState<{lessonId: string, resource: any} | null>(null);
  const [editResourceTitle, setEditResourceTitle] = useState('');
  const [editResourceUrl, setEditResourceUrl] = useState('');
  const [editResourceType, setEditResourceType] = useState('pdf');
  const [editResourceLoading, setEditResourceLoading] = useState(false);
  const [editResourceError, setEditResourceError] = useState<string | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/courses/${courseId}/sections`);
      const data = await response.json();
      if (response.ok && data.success) {
        setSections(data.data);
      } else {
        setError(data.message || 'Failed to load sections');
      }
    } catch (err) {
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchSections();
    // eslint-disable-next-line
  }, [courseId]);

  // Fetch lessons for all sections after fetching sections
  useEffect(() => {
    if (!sections.length) return;
    const fetchLessons = async () => {
      const newLessonsBySection = {};
      for (const section of sections) {
        try {
          const response = await fetch(`/api/courses/${courseId}/sections/${section.id}/lessons`);
          const data = await response.json();
          if (response.ok && data.success) {
            newLessonsBySection[section.id] = data.data;
          } else {
            newLessonsBySection[section.id] = [];
          }
        } catch {
          newLessonsBySection[section.id] = [];
        }
      }
      setLessonsBySection(newLessonsBySection);
    };
    fetchLessons();
  }, [sections, courseId]);

  // Fetch resources for all lessons after fetching lessons
  useEffect(() => {
    if (!Object.keys(lessonsBySection).length) return;
    const fetchResources = async () => {
      const newResourcesByLesson = {};
      for (const sectionId in lessonsBySection) {
        const lessons = lessonsBySection[sectionId];
        for (const lesson of lessons) {
          try {
            const response = await fetch(`/api/resources/lesson/${lesson.id}`);
            const data = await response.json();
            if (response.ok) {
              newResourcesByLesson[lesson.id] = data;
            } else {
              newResourcesByLesson[lesson.id] = [];
            }
          } catch {
            newResourcesByLesson[lesson.id] = [];
          }
        }
      }
      setResourcesByLesson(newResourcesByLesson);
    };
    fetchResources();
  }, [lessonsBySection]);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: addTitle,
          order: addOrder ? parseInt(addOrder) : sections.length + 1,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAddOpen(false);
        setAddTitle('');
        setAddOrder('');
        fetchSections();
      } else {
        setAddError(data.message || 'Failed to add section');
      }
    } catch (err) {
      setAddError('Failed to add section');
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addLessonOpen) return;
    setLessonLoading(true);
    setLessonError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/sections/${addLessonOpen}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: lessonTitle,
          videoUrl: lessonVideoUrl,
          description: lessonDescription,
          duration: parseInt(lessonDuration),
          isPreview: lessonIsPreview,
          order: 1,
          courseId,
          sectionId: addLessonOpen
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAddLessonOpen(null);
        setLessonTitle('');
        setLessonVideoUrl('');
        setLessonDescription('');
        setLessonDuration('');
        setLessonIsPreview(false);
        fetchSections();
      } else {
        setLessonError(data.message || 'Failed to add lesson');
      }
    } catch (err) {
      setLessonError('Failed to add lesson');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteLessonInfo) return;
    setDeleteLessonLoading(true);
    setDeleteLessonError(null);
    try {
      const token = localStorage.getItem('token');
      const { sectionId, lessonId } = deleteLessonInfo;
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDeleteLessonInfo(null);
        // Refresh lessons for the section
        const response2 = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`);
        const data2 = await response2.json();
        setLessonsBySection(prev => ({ ...prev, [sectionId]: data2.data }));
      } else {
        setDeleteLessonError(data.message || 'Failed to delete lesson');
      }
    } catch (err) {
      setDeleteLessonError('Failed to delete lesson');
    } finally {
      setDeleteLessonLoading(false);
    }
  };

  const openEditLesson = (sectionId: string, lesson: any) => {
    setEditLessonInfo({ sectionId, lesson });
    setEditLessonTitle(lesson.title || '');
    setEditLessonVideoUrl(lesson.videoUrl || '');
    setEditLessonDescription(lesson.description || '');
    setEditLessonDuration(lesson.duration ? lesson.duration.toString() : '');
    setEditLessonIsPreview(!!lesson.isPreview);
    setEditLessonError(null);
  };
  const handleEditLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLessonInfo) return;
    setEditLessonLoading(true);
    setEditLessonError(null);
    try {
      const token = localStorage.getItem('token');
      const { sectionId, lesson } = editLessonInfo;
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: editLessonTitle,
          videoUrl: editLessonVideoUrl,
          description: editLessonDescription,
          duration: parseInt(editLessonDuration),
          isPreview: editLessonIsPreview,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEditLessonInfo(null);
        // Refresh lessons for the section
        const response2 = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`);
        const data2 = await response2.json();
        setLessonsBySection(prev => ({ ...prev, [sectionId]: data2.data }));
      } else {
        setEditLessonError(data.message || 'Failed to update lesson');
      }
    } catch (err) {
      setEditLessonError('Failed to update lesson');
    } finally {
      setEditLessonLoading(false);
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteSectionId) return;
    setDeleteSectionLoading(true);
    setDeleteSectionError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/sections/${deleteSectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDeleteSectionId(null);
        fetchSections();
      } else {
        setDeleteSectionError(data.message || 'Failed to delete section');
      }
    } catch (err) {
      setDeleteSectionError('Failed to delete section');
    } finally {
      setDeleteSectionLoading(false);
    }
  };

  const openEditSection = (section: any) => {
    setEditSectionInfo(section);
    setEditSectionTitle(section.title || '');
    setEditSectionOrder(section.order ? section.order.toString() : '');
    setEditSectionError(null);
  };
  const handleEditSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSectionInfo) return;
    setEditSectionLoading(true);
    setEditSectionError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/sections/${editSectionInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: editSectionTitle,
          order: editSectionOrder ? parseInt(editSectionOrder) : editSectionInfo.order,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEditSectionInfo(null);
        fetchSections();
      } else {
        setEditSectionError(data.message || 'Failed to update section');
      }
    } catch (err) {
      setEditSectionError('Failed to update section');
    } finally {
      setEditSectionLoading(false);
    }
  };

  // Resource management functions
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addResourceOpen) return;
    setResourceLoading(true);
    setResourceError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: resourceTitle,
          url: resourceUrl,
          type: resourceType,
          lessonId: addResourceOpen
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAddResourceOpen(null);
        setResourceTitle('');
        setResourceUrl('');
        setResourceType('pdf');
        // Refresh resources for this lesson
        const response2 = await fetch(`/api/resources/lesson/${addResourceOpen}`);
        const data2 = await response2.json();
        setResourcesByLesson(prev => ({ ...prev, [addResourceOpen]: data2 }));
      } else {
        setResourceError(data.error || 'Failed to add resource');
      }
    } catch (err) {
      setResourceError('Failed to add resource');
    } finally {
      setResourceLoading(false);
    }
  };

  const handleDeleteResource = async () => {
    if (!deleteResourceInfo) return;
    setDeleteResourceLoading(true);
    setDeleteResourceError(null);
    try {
      const token = localStorage.getItem('token');
      const { lessonId, resourceId } = deleteResourceInfo;
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDeleteResourceInfo(null);
        // Refresh resources for this lesson
        const response2 = await fetch(`/api/resources/lesson/${lessonId}`);
        const data2 = await response2.json();
        setResourcesByLesson(prev => ({ ...prev, [lessonId]: data2 }));
      } else {
        setDeleteResourceError(data.error || 'Failed to delete resource');
      }
    } catch (err) {
      setDeleteResourceError('Failed to delete resource');
    } finally {
      setDeleteResourceLoading(false);
    }
  };

  const openEditResource = (lessonId: string, resource: any) => {
    setEditResourceInfo({ lessonId, resource });
    setEditResourceTitle(resource.title);
    setEditResourceUrl(resource.url);
    setEditResourceType(resource.type);
  };

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editResourceInfo) return;
    setEditResourceLoading(true);
    setEditResourceError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/resources/${editResourceInfo.resource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: editResourceTitle,
          url: editResourceUrl,
          type: editResourceType,
          lessonId: editResourceInfo.lessonId
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setEditResourceInfo(null);
        setEditResourceTitle('');
        setEditResourceUrl('');
        setEditResourceType('pdf');
        // Refresh resources for this lesson
        const response2 = await fetch(`/api/resources/lesson/${editResourceInfo.lessonId}`);
        const data2 = await response2.json();
        setResourcesByLesson(prev => ({ ...prev, [editResourceInfo.lessonId]: data2 }));
      } else {
        setEditResourceError(data.error || 'Failed to update resource');
      }
    } catch (err) {
      setEditResourceError('Failed to update resource');
    } finally {
      setEditResourceLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Course Builder</h1>
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Sections & Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading sections...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : sections.length === 0 ? (
                <div className="text-muted-foreground mb-4">No sections yet.</div>
              ) : (
                sections.map(section => (
                  <div key={section.id} className="mb-6 border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold">{section.title}</h2>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditSection(section)}>Edit Section</Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteSectionId(section.id)}>Delete</Button>
                      </div>
                    </div>
                    {/* Lessons for this section */}
                    {lessonsBySection[section.id] && lessonsBySection[section.id].length > 0 ? (
                      <ul className="ml-4 mb-2">
                        {lessonsBySection[section.id].map(lesson => (
                          <li key={lesson.id} className="flex items-center justify-between py-1">
                            <span>{typeof lesson.title === 'string' ? lesson.title : '[Untitled]'} <span className="text-xs text-muted-foreground">({typeof lesson.videoUrl === 'string' && lesson.videoUrl ? 'video' : 'text'})</span></span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditLesson(section.id, lesson)}>Edit Lesson</Button>
                              <Button size="sm" variant="destructive" onClick={() => setDeleteLessonInfo({sectionId: section.id, lessonId: lesson.id})}>Delete</Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="ml-4 text-muted-foreground text-sm mb-2">No lessons yet.</div>
                    )}
                    <Button size="sm" className="mt-2" onClick={() => setAddLessonOpen(section.id)}>+ Add Lesson</Button>
                  </div>
                ))
              )}
              <Button variant="secondary" className="mt-2" onClick={() => setAddOpen(true)}>+ Add Section</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quiz management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading sections...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : sections.length === 0 ? (
                <div className="text-muted-foreground mb-4">No sections yet. Add sections first to manage resources.</div>
              ) : (
                sections.map(section => (
                  <div key={section.id} className="mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                    {lessonsBySection[section.id] && lessonsBySection[section.id].length > 0 ? (
                      <div className="ml-4">
                        {lessonsBySection[section.id].map(lesson => (
                          <div key={lesson.id} className="mb-4 p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{lesson.title}</h3>
                              <Button size="sm" onClick={() => setAddResourceOpen(lesson.id)}>+ Add Resource</Button>
                            </div>
                            {/* Resources for this lesson */}
                            {resourcesByLesson[lesson.id] && resourcesByLesson[lesson.id].length > 0 ? (
                              <ul className="ml-4">
                                {resourcesByLesson[lesson.id].map(resource => (
                                  <li key={resource.id} className="flex items-center justify-between py-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{resource.type}</span>
                                      <span>{resource.title}</span>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View</a>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" onClick={() => openEditResource(lesson.id, resource)}>Edit</Button>
                                      <Button size="sm" variant="destructive" onClick={() => setDeleteResourceInfo({lessonId: lesson.id, resourceId: resource.id})}>Delete</Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="ml-4 text-muted-foreground text-sm">No resources yet.</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="ml-4 text-muted-foreground text-sm mb-2">No lessons yet. Add lessons first to manage resources.</div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogH>
            <DialogT>Add Section</DialogT>
          </DialogH>
          <form onSubmit={handleAddSection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={addTitle}
                onChange={e => setAddTitle(e.target.value)}
                required
                placeholder="Section title"
                disabled={addLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <Input
                type="number"
                value={addOrder}
                onChange={e => setAddOrder(e.target.value)}
                placeholder={`e.g. ${sections.length + 1}`}
                min={1}
                disabled={addLoading}
              />
            </div>
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={addLoading}>Cancel</Button>
              <Button type="submit" disabled={addLoading || !addTitle}>{addLoading ? 'Adding...' : 'Add Section'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!addLessonOpen} onOpenChange={open => setAddLessonOpen(open ? addLessonOpen : null)}>
        <DialogContent>
          <DialogH>
            <DialogT>Add Lesson</DialogT>
          </DialogH>
          <form className="space-y-4" onSubmit={handleAddLesson}>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={lessonTitle}
                onChange={e => setLessonTitle(e.target.value)}
                required
                placeholder="Lesson title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video URL *</label>
              <Input
                value={lessonVideoUrl}
                onChange={e => setLessonVideoUrl(e.target.value)}
                required
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Input
                value={lessonDescription}
                onChange={e => setLessonDescription(e.target.value)}
                required
                placeholder="Lesson description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
              <Input
                type="number"
                value={lessonDuration}
                onChange={e => setLessonDuration(e.target.value)}
                required
                placeholder="e.g. 10"
                min={1}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPreview"
                checked={lessonIsPreview}
                onChange={e => setLessonIsPreview(e.target.checked)}
              />
              <label htmlFor="isPreview" className="text-sm">Is Preview</label>
            </div>
            {lessonError && <div className="text-red-500 text-sm">{lessonError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddLessonOpen(null)} disabled={lessonLoading}>Cancel</Button>
              <Button type="submit" disabled={lessonLoading || !lessonTitle || !lessonVideoUrl || !lessonDescription || !lessonDuration}>{lessonLoading ? 'Adding...' : 'Add Lesson'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editLessonInfo} onOpenChange={open => !open && setEditLessonInfo(null)}>
        <DialogContent>
          <DialogH>
            <DialogT>Edit Lesson</DialogT>
          </DialogH>
          <form className="space-y-4" onSubmit={handleEditLesson}>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={editLessonTitle}
                onChange={e => setEditLessonTitle(e.target.value)}
                required
                placeholder="Lesson title"
                disabled={editLessonLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video URL *</label>
              <Input
                value={editLessonVideoUrl}
                onChange={e => setEditLessonVideoUrl(e.target.value)}
                required
                placeholder="https://..."
                disabled={editLessonLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Input
                value={editLessonDescription}
                onChange={e => setEditLessonDescription(e.target.value)}
                required
                placeholder="Lesson description"
                disabled={editLessonLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
              <Input
                type="number"
                value={editLessonDuration}
                onChange={e => setEditLessonDuration(e.target.value)}
                required
                placeholder="e.g. 10"
                min={1}
                disabled={editLessonLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsPreview"
                checked={editLessonIsPreview}
                onChange={e => setEditLessonIsPreview(e.target.checked)}
                disabled={editLessonLoading}
              />
              <label htmlFor="editIsPreview" className="text-sm">Is Preview</label>
            </div>
            {editLessonError && <div className="text-red-500 text-sm">{editLessonError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditLessonInfo(null)} disabled={editLessonLoading}>Cancel</Button>
              <Button type="submit" disabled={editLessonLoading || !editLessonTitle || !editLessonVideoUrl || !editLessonDescription || !editLessonDuration}>{editLessonLoading ? 'Saving...' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editSectionInfo} onOpenChange={open => !open && setEditSectionInfo(null)}>
        <DialogContent>
          <DialogH>
            <DialogT>Edit Section</DialogT>
          </DialogH>
          <form className="space-y-4" onSubmit={handleEditSection}>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={editSectionTitle}
                onChange={e => setEditSectionTitle(e.target.value)}
                required
                placeholder="Section title"
                disabled={editSectionLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <Input
                type="number"
                value={editSectionOrder}
                onChange={e => setEditSectionOrder(e.target.value)}
                placeholder={`e.g. ${editSectionInfo ? editSectionInfo.order : ''}`}
                min={1}
                disabled={editSectionLoading}
              />
            </div>
            {editSectionError && <div className="text-red-500 text-sm">{editSectionError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditSectionInfo(null)} disabled={editSectionLoading}>Cancel</Button>
              <Button type="submit" disabled={editSectionLoading || !editSectionTitle}>{editSectionLoading ? 'Saving...' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteLessonInfo} onOpenChange={open => !open && setDeleteLessonInfo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
          </AlertDialogHeader>
          <div>Are you sure you want to delete this lesson? This action cannot be undone.</div>
          {deleteLessonError && <div className="text-red-500 text-sm">{deleteLessonError}</div>}
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteLessonInfo(null)} disabled={deleteLessonLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLesson} disabled={deleteLessonLoading}>{deleteLessonLoading ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deleteSectionId} onOpenChange={open => !open && setDeleteSectionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
          </AlertDialogHeader>
          <div>Are you sure you want to delete this section? All lessons in this section will also be deleted. This action cannot be undone.</div>
          {deleteSectionError && <div className="text-red-500 text-sm">{deleteSectionError}</div>}
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteSectionId(null)} disabled={deleteSectionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSection} disabled={deleteSectionLoading}>{deleteSectionLoading ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Resource Management Dialogs */}
      <Dialog open={!!addResourceOpen} onOpenChange={open => setAddResourceOpen(open ? addResourceOpen : null)}>
        <DialogContent>
          <DialogH>
            <DialogT>Add Resource</DialogT>
          </DialogH>
          <form className="space-y-4" onSubmit={handleAddResource}>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={resourceTitle}
                onChange={e => setResourceTitle(e.target.value)}
                required
                placeholder="Resource title"
                disabled={resourceLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL *</label>
              <Input
                value={resourceUrl}
                onChange={e => setResourceUrl(e.target.value)}
                required
                placeholder="https://..."
                disabled={resourceLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={resourceType}
                onChange={e => setResourceType(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={resourceLoading}
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>
            {resourceError && <div className="text-red-500 text-sm">{resourceError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddResourceOpen(null)} disabled={resourceLoading}>Cancel</Button>
              <Button type="submit" disabled={resourceLoading || !resourceTitle || !resourceUrl}>{resourceLoading ? 'Adding...' : 'Add Resource'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!editResourceInfo} onOpenChange={open => !open && setEditResourceInfo(null)}>
        <DialogContent>
          <DialogH>
            <DialogT>Edit Resource</DialogT>
          </DialogH>
          <form className="space-y-4" onSubmit={handleEditResource}>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={editResourceTitle}
                onChange={e => setEditResourceTitle(e.target.value)}
                required
                placeholder="Resource title"
                disabled={editResourceLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL *</label>
              <Input
                value={editResourceUrl}
                onChange={e => setEditResourceUrl(e.target.value)}
                required
                placeholder="https://..."
                disabled={editResourceLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={editResourceType}
                onChange={e => setEditResourceType(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={editResourceLoading}
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>
            {editResourceError && <div className="text-red-500 text-sm">{editResourceError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditResourceInfo(null)} disabled={editResourceLoading}>Cancel</Button>
              <Button type="submit" disabled={editResourceLoading || !editResourceTitle || !editResourceUrl}>{editResourceLoading ? 'Saving...' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteResourceInfo} onOpenChange={open => !open && setDeleteResourceInfo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
          </AlertDialogHeader>
          <div>Are you sure you want to delete this resource? This action cannot be undone.</div>
          {deleteResourceError && <div className="text-red-500 text-sm">{deleteResourceError}</div>}
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteResourceInfo(null)} disabled={deleteResourceLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteResource} disabled={deleteResourceLoading}>{deleteResourceLoading ? 'Deleting...' : 'Delete'}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseBuilderPage; 